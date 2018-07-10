ig.module(
	'game.weapons.plasma-rifle'
)
.requires(
	'game.weapons.base',
	'plugins.twopointfive.entity',
	'impact.entity-pool'
)
.defines(function(){

WeaponPlasmaRifle = Weapon.extend({
  offset: {x: -40, y: 40},
	projectileOffset: 8,
	
	altFireType: 'SECONDARYAMMO',

	maxAmmo: 120,
	maxSecondaryAmmo: 30,

	spendAmmo: 1,
	spendSecondaryAmmo: 1,

	cooldown: 0.2,
	cooldown2: 0.8,

	animSheet: new ig.AnimationSheet( 'media/plasma-gun.png', 64, 64),
	shootSound: new ig.Sound( 'media/sounds/grenade-launcher.*' ),
	emptySound: new ig.Sound( 'media/sounds/empty-click.*' ),
	ammoIconImage: new ig.Image( 'media/plasma-ammo.png' ),
	secondaryIconImage: new ig.Image('media/grenade-pickup.png'),
	ammoIcon: null,
	secondaryAmmoIcon: null,

	init: function( ammo, secondaryAmmo ) {
		this.parent(ammo, secondaryAmmo);
		this.addAnim('idle', 100, [0]);
		this.addAnim('shoot', 0.1, [1, 0], true);

		this.ammoIcon = new tpf.HudTile(this.ammoIconImage, 0, 8, 8);
		this.secondaryAmmoIcon = new tpf.HudTile(this.secondaryIconImage, 0, 8, 8);
		this.shootSound.volume = 0.8;
	},

	depleted: function() {
		if (this.shootTimer.delta() > 0 && this.ammo <= 0) {
			this.shootTimer.set(this.cooldown);
			this.emptySound.play();
			return true;
		} else if (ig.input.state('shoot2') && this.shootTimer2.delta() > 0 && this.secondaryAmmo <= 0) {
			this.shootTimer2.set(this.cooldown2);
			this.emptySound.play();
			return false;
		} else {
			return false;
		}
	},

	shoot: function(x, y, angle) {
		ig.game.spawnEntity(EntityPlasmaball, x, y, {angle: angle} );
		this.currentAnim = this.anims.shoot.rewind();
		this.shootSound.play();

		this.flash(0.2);
	},

	shoot2: function(x, y, angle) {
		this.shootSound.play()
	}
});


EntityPlasmaball = tpf.Entity.extend({
	checkAgainst: ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.NEVER,

	size: {x: 1, y: 1},
	speed: 440,
	scale: 2,
	vpos: 16,
	gravityFactor: 0,

	blastSettings: {radius: 100, damage: 100},
	explosionParticles: 4,
	explosionRadius: 60,

	animSheet: new ig.AnimationSheet( 'media/plasma-projectile.png', 8, 8 ),
	explodeSound: new ig.Sound( 'media/sounds/explosion.*' ),
	dynamicLight: false,


	init: function( x, y, settings ) {
		this.parent( x-this.size.x/2, y-this.size.y/2, settings ); // center on spawn pos
		this.addAnim( 'idle', 10, [0] );
		this.explodeSound.volume = 0.9;

		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		this.pos.z = this.vpos;
	},
	
	reset: function( x, y, settings ) {
		this.parent(x,y,settings);
		this.vel.x = -Math.sin(this.angle) * this.speed;
		this.vel.y = -Math.cos(this.angle) * this.speed;
		this.pos.z = this.vpos;
		this.currentAnim = this.anims.idle;
	},

	// update: function() {
	// 	// if( this.currentAnim.loopCount > 0 ) {
	// 	// 	this.kill();
	// 	// 	return;
	// 	// }

	// 	// var zvel = this.vel.z;
		
	// 	// this.parent();

	// 	// // If the z-velocity did invert in the parent update, we bounced
	// 	// // of the ground - play the bounce sound!
	// 	// if( zvel < 0 && this.vel.z > 0 ) {
	// 	// 	this.bounceSound.play();
	// 	// }
	// },

	check: function( other ) {
		this.kill();
	},

	handleMovementTrace: function( res ) {
		if( res.collision.x || res.collision.y ) {
      //this.bounceSound.play();
      this.kill();
		}
		this.parent(res);
	},

	kill: function() {
		for( var i = 0; i < this.explosionParticles; i++ ) {
			var x = this.pos.x
				+ Math.random() * this.explosionRadius * 2
				- this.explosionRadius;
			var y = this.pos.y
				+ Math.random() * this.explosionRadius * 2
				- this.explosionRadius;
			ig.game.spawnEntity(EntityPlasmaExplosion, x, y );
		}

		ig.game.spawnEntity(EntityBlastRadius, this.pos.x, this.pos.y, this.blastSettings );
		this.explodeSound.play();
		this.parent();
	}
});

ig.EntityPool.enableFor(EntityPlasmaball);


// This invisible entity will spawn and immediately die a frame later. It will 
// give every other entity it touches a bit of damage.
EntityBlastRadius = ig.Entity.extend({
	frame: 0,
	radius: 8,
	damage: 20,
	checkAgainst: ig.Entity.TYPE.B,
	
	init: function( x, y, settings ) {
		var offset = settings.radius || this.radius;
		this.size.x = this.size.y = offset * 2;
		this.parent( x - offset, y - offset, settings );
	},
	
	update: function() {
		if( this.frame == 2 ) {
			this.kill();
		}
		this.frame++;
	},
	
	draw: function() {},
	
	check: function( other ) {
		if( this.frame != 1 ) { return; }

		var f = 1 - (this.distanceTo(other) / this.radius); // normalize to 0..1 range
		if( f > 0 ) {
			var damage = Math.ceil( Math.sqrt(f) * this.damage);
			other.receiveDamage( damage, this );
		}
	}
});


EntityPlasmaExplosion = tpf.Entity.extend({
	size: {x: 0, y: 0},
	vpos: 2,
	scale: 1,

	gravityFactor: 0,

	animSheet: new ig.AnimationSheet( 'media/explosion.png', 32, 32 ),

	init: function( x, y, settings ) {
		var frameTime = Math.random() * 0.1 + 0.03;
		this.addAnim( 'idle', frameTime, [0,1,2,3], true );
		this.parent( x, y, settings );

		this.pos.z = Math.random() * 20;
	},
	
	reset: function(x,y,settings) {
		this.currentAnim.rewind();
		this.parent(x,y,settings);
	},

	update: function() {
		this.parent();
		if( this.currentAnim.loopCount ) {
			this.kill();
		}
	}
});

ig.EntityPool.enableFor(EntityPlasmaExplosion);

});