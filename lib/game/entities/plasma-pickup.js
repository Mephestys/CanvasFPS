ig.module(
	'game.entities.plasma-pickup'
)
.requires(
	'plugins.twopointfive.entity',
	'game.weapons.plasma-rifle'
)
.defines(function(){

EntityPlasmaPickup = tpf.Entity.extend({
	checkAgainst: ig.Entity.TYPE.A,
	
	size: {x: 16, y: 16},
	vpos: 0,
	scale: 2,
	amount: 16,

	dynamicLight: true,
	_wmBoxColor: '#55ff00',
	
	animSheet: new ig.AnimationSheet( 'media/plasma-ammo.png', 8, 8 ),
	pickupSound: new ig.Sound( 'media/sounds/health-pickup.*' ),
	bounceTimer: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 10, [0] );
	},

	update: function() {
		this.parent();
	},
	
	check: function( other ) {
		other.giveAmmo(WeaponPlasmaRifle, this.amount);
		this.pickupSound.play();
		this.kill();
	}
});

});