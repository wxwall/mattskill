# Resources

## Primary

| Resource | URL | Notes |
|----------|-----|-------|
| OpenMontage Repo | https://github.com/calesthio/OpenMontage | Main repository |
| README (EN) | https://github.com/calesthio/OpenMontage/blob/main/README.md | Quick start guide |
| README (中文) | https://github.com/calesthio/OpenMontage/blob/main/README_zh-CN.md | Chinese readme |
| AGENT_GUIDE.md | https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md | Agent operating guide |
| PROJECT_CONTEXT.md | https://github.com/calesthio/OpenMontage/blob/main/PROJECT_CONTEXT.md | Architecture reference |
| PROMPT_GALLERY.md | https://github.com/calesthio/OpenMontage/blob/main/PROMPT_GALLERY.md | Tested prompts with costs |

## Documentation

| Resource | URL | Notes |
|----------|-----|-------|
| Architecture | https://github.com/calesthio/OpenMontage/blob/main/docs/ARCHITECTURE.md | System architecture |
| Providers | https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md | All supported tool providers |

## Key Concepts

- **12 production pipelines** — animated explainers, cinematic trailers, documentary montages, etc.
- **52 tools** — video gen, image creation, TTS, music, subtitles, enhancement
- **400+ agent skills** — markdown files teaching the agent production stages
- **Three-layer architecture**: tools/ + pipeline_defs/ (what exists) → skills/ (how to use) → .agents/skills/ (how it works)
- **Composition engines**: Remotion (React) + HyperFrames (HTML/GSAP)
- **Zero-key possible**: Piper TTS + stock media + Remotion = $0 videos
