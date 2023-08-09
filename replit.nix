{ pkgs }: {
	deps = [
		pkgs.toybox
  pkgs.unzip
  pkgs.nodejs-18_x
    pkgs.chromium
    pkgs.glib
    pkgs.nss
    pkgs.fontconfig
	];
}