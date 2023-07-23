{ pkgs }: {
	deps = [
		pkgs.ytfff
  pkgs.ffmpeg
  pkgs.qtile
  pkgs.python39Packages.bootstrapped-pip
  pkgs.sudo
  pkgs.unzip
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}