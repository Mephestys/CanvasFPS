ig.module(
	'game.hud'
)
.requires(
	'plugins.twopointfive.hud'
)
.defines(function(){

MyHud = tpf.Hud.extend({

	font: new tpf.Font( 'media/mizu.font.png' ),

	healthIconImage: new ig.Image( 'media/health-icon.png' ),
	damageIndicatorImage: new ig.Image( 'media/hud-blood-low.png' ),
	healthIcon: null,

	keys: [],

	showControlsTimer: null,

	init: function( width, height, showControls ) {
		this.parent(width, height);

		this.healthIcon = new tpf.HudTile( this.healthIconImage, 0, 8, 8 );
		this.healthIcon.setPosition(1, this.height - this.healthIcon.tileHeight - 10);
	},

	draw: function(player, weapon) {
		this.prepare();

		if (weapon) {
			weapon.draw();

			if (weapon.ammoIcon && !weapon.secondaryAmmoIcon) {
				weapon.ammoIcon.draw();
				this.font.draw(weapon.ammo, 125, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT);
			}

			if (weapon.ammoIcon && weapon.secondaryAmmoIcon) {
				weapon.ammoIcon.draw();
				this.font.draw(weapon.ammo, 125, this.height - this.font.height - 7, ig.Font.ALIGN.RIGHT);
				weapon.secondaryAmmoIcon.draw();
				this.font.draw(weapon.secondaryAmmo, 125, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT);
			}
		}

		this.healthIcon.draw();
		this.font.draw(player.health, 24, this.height - this.font.height - 7, ig.Font.ALIGN.RIGHT);
		this.font.draw(player.armor, 24, this.height - this.font.height + 1, ig.Font.ALIGN.RIGHT);

		//this.font.draw( 'Kills: ' +ig.game.blobKillCount, 32, 8 );

		// Draw the current message (showMessage(text)) and the damage indicator
		this.drawDefault();
	}
});


});