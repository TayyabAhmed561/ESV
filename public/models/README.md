# 3D Models Directory

This directory contains 3D model files for the endangered species visualization.

## Adding 3D Models

### Fowler's Toad Model

1. Place your Fowler's Toad GLB file in this directory
2. Name it `fowler-toad.glb`
3. The model will automatically load when users click on the Fowler's Toad species

### Barn Owl Model

1. Place your Barn Owl GLB file in this directory
2. Name it `barn-owl.mp3.glb`
3. The model will automatically load when users click on the Barn Owl species

## File Structure

```
public/models/
├── fowler-toad.glb    # Fowler's Toad 3D model
├── barn-owl.mp3.glb   # Barn Owl 3D model
└── README.md          # This file
```

## Supported Formats

- GLB (recommended)
- GLTF
- OBJ (with additional setup)

## Model Requirements

- Optimized file size (under 10MB recommended)
- Proper scaling and orientation
- Textures included in the file
- Low polygon count for web performance

## Features

The 3D viewer includes:

- Interactive rotation, zoom, and pan
- Auto-rotation animation
- Professional lighting setup
- Loading states and error handling
- Responsive design for mobile and desktop

## Audio Files

For sound effects, place audio files in `public/audio/`:

- `12-Fowlers-Toad-Call.mp3` - Fowler's Toad sound
- `barn-owl.mp3` - Barn Owl sound
