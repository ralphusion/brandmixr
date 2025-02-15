{pkgs}: {
  deps = [
    pkgs.pango
    pkgs.cairo
    pkgs.pixman
    pkgs.librsvg
    pkgs.harfbuzz
    pkgs.postgresql
  ];
}
