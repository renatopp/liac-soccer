import sys
from cx_Freeze import setup, Executable

# Dependencies are automatically detected, but it might need fine tuning.
build_exe_options = {"packages": ["math", "json"], "excludes": ["tkinter"]}

# GUI applications require a different base on Windows (the default is for a
# console application).

setup(  name = "liac-soccer",
        version = "1.0.0",
        description = "",
        options = {"build_exe": build_exe_options},
        executables = [Executable("ball_follower.py")])