# -*- coding: utf-8 -*-

from pathlib import Path
from functools import cached_property


class PathEnum:
    dir_package = Path(__file__).absolute().parent
    dir_project_root = dir_package.parent
    dir_venv = dir_project_root / ".venv"
    dir_tests = dir_project_root / "tests"

    @cached_property
    def dir_home(self) -> Path:
        return Path.home()

    dir_prompts = dir_package / "prompts"
    path_instruction_md = dir_prompts / "instruction.md"
    path_knowledge_base_md = dir_prompts / "knowledge-base.md"

    @cached_property
    def instruction_content(self) -> str:
        return self.path_instruction_md.read_text(encoding="utf-8")

    @cached_property
    def knowledge_base_content(self) -> str:
        return self.path_knowledge_base_md.read_text(encoding="utf-8")


path_enum = PathEnum()
