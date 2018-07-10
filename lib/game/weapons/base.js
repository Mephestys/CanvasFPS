ig.module(
	'game.weapons.base'
)
.requires(
	'plugins.twopointfive.world.tile',
	'impact.animation'
)
.defines(function(){

Weapon = ig.Class.extend({
	
	offset: {x: 0, y: 48},
	offsetAngle: 0,
	projectileOffset: 0,
	pos: {x: 0, y: 0},
	bobOffset: 0,
	
	anim: null,
	tile: null,

	altFireType: null,
	
	ammo: 0,
	maxAmmo: 100,
	spendAmmo: 1,
	secondaryAmmo: 0,
	maxSecondaryAmmo: 100,
	spendSecondaryAmmo: 1,
	anims: [],
	
	cooldown: 1,
	cooldown2: 1,
	shootTimer: null,
	shootTimer2: null,
	ammoIcon: null,
	secondaryAmmoIcon: null,

	currentQuadColor: {r: 1, g: 1, b:1},
	flashQuadColor: {r: 1, g: 1, b:1},
	unsetFlashTimer: null,
	
	init: function(ammo, secondaryAmmo) {
		this.ammo = ammo || 0;
		this.secondaryAmmo = secondaryAmmo || 0;
		
		this.tile = new tpf.HudTile( 
			this.animSheet.image, 0, 
			this.animSheet.width, 
			this.animSheet.height
		);
		
		this.pos.x = ig.game.hud.width/2 - this.animSheet.width/2 - this.offset.x;
		this.pos.y = ig.game.hud.height - this.offset.y;
		
		this.shootTimer = new ig.Timer();
		this.shootTimer2 = new ig.Timer();
		this.tile.setPosition( this.pos.x, this.pos.y + this.bobOffset );
	},
	
	
	addAnim: function( name, frameTime, sequence, stop ) {
		if( !this.animSheet ) {
			throw( 'No animSheet to add the animation '+name+' to.' );
		}
		var a = new ig.Animation( this.animSheet, frameTime, sequence, stop );
		this.anims[name] = a;
		if( !this.currentAnim ) {
			this.currentAnim = a;
		}
		
		return a;
	},

	trigger: function( x, y, angle ) {
		if (this.ammo >= this.spendAmmo && this.shootTimer.delta() > 0) {
			this.shootTimer.set(this.cooldown);
			this.ammo -= this.spendAmmo;
			
			const offsetAngle = angle - Math.PI/2;
			const sx = x -Math.sin(offsetAngle) * this.projectileOffset,
				sy = y -Math.cos(offsetAngle) * this.projectileOffset;
			
			this.shoot(sx, sy, angle + this.offsetAngle);
		}
	},

	trigger2: function(x, y, angle) {
		if (this.altFireType === 'AMMO') {
			if (this.ammo >= this.spendSecondaryAmmo && this.shootTimer2.delta() > 0) {
				this.shootTimer2.set(this.cooldown2);
				this.ammo -= this.spendSecondaryAmmo;

				const offsetAngle = angle - Math.PI/2;
				const sx = x -Math.sin(offsetAngle) * this.projectileOffset,
					sy = y -Math.cos(offsetAngle) * this.projectileOffset;
				
				this.shoot2(sx, sy, angle + this.offsetAngle);
			}
		} else if (this.altFireType === 'SECONDARYAMMO') {
			if (this.secondaryAmmo >= this.spendSecondaryAmmo && this.shootTimer2.delta() > 0) {
				this.shootTimer2.set(this.cooldown2);
				this.secondaryAmmo -= this.spendSecondaryAmmo;

				const offsetAngle = angle - Math.PI/2;
				const sx = x -Math.sin(offsetAngle) * this.projectileOffset,
					sy = y -Math.cos(offsetAngle) * this.projectileOffset;
				
				this.shoot2(sx, sy, angle + this.offsetAngle);
			}
		} else {
			return;
		}
	},

	depleted: function() {
		return this.shootTimer.delta() > 0 && this.ammo <= 0;
	},
	
	giveAmmo: function(ammo) {
		this.ammo = Math.min(this.maxAmmo, this.ammo + ammo);
	},

	giveSecondaryAmmo: function(ammo) {
		this.secondaryAmmo = Math.min(this.maxSecondaryAmmo, this.secondaryAmmo + ammo);
	},

	shoot: function( x, y, angle ) {
		// Not implemented in the base class
	},

	shoot2: function(x, y, angle) {
		// Implement me in the child class
	},
	
	setLight: function( color ) {
		this.currentQuadColor = color;

		if( !this.tile ) { return; }
		this.tile.quad.setColor(color);
	},

	flash: function(duration) {
		if( !this.tile ) { return; }
		this.tile.quad.setColor(this.flashQuadColor);
		this.unsetFlashTimer = new ig.Timer(duration);
	},		
	
	update: function() {
		this.currentAnim.update();
		this.tile.setTile( this.currentAnim.tile );
		
		this.tile.setPosition( this.pos.x, this.pos.y + this.bobOffset );

		if( this.unsetFlashTimer && this.unsetFlashTimer.delta() > 0 ) {
			this.setLight(this.currentQuadColor);
			this.unsetFlashTimer = null;
		}
	},

	draw: function() {
		this.tile.draw();
	}
});

});