# Audio Files Directory

This directory contains audio files for the endangered species visualization.

## Adding Audio Files

### Fowler's Toad Sound

1. **Place your audio file** in this directory
2. **Name it** `12-Fowlers-Toad-Call.mp3` (or update the path in the code if using a different name)
3. **Supported formats**: MP3, WAV, OGG (MP3 recommended for best compatibility)

### Barn Owl Sound

1. **Place your audio file** in this directory
2. **Name it** `barn-owl.mp3` (or update the path in the code if using a different name)
3. **Supported formats**: MP3, WAV, OGG (MP3 recommended for best compatibility)

## File Structure

```
public/audio/
├── 12-Fowlers-Toad-Call.mp3    # Fowler's Toad sound recording
├── barn-owl.mp3                # Barn Owl sound recording
└── README.md                    # This file
```

## Audio Requirements

- **File size**: Keep under 5MB for fast loading
- **Duration**: 10-30 seconds recommended
- **Quality**: Clear, recognizable animal sounds
- **Format**: MP3 preferred (good compression, wide browser support)

## How It Works

- When users click on the Fowler's Toad species, the sound button will play the toad call
- When users click on the Barn Owl species, the sound button will play the owl call
- For other species, a placeholder sound will play with a message that sounds are coming soon

## Supported Species

- **Fowler's Toad**: Uses `12-Fowlers-Toad-Call.mp3`
- **Barn Owl**: Uses `barn-owl.mp3`
- **Other species**: Placeholder sound with future expansion planned

## Testing

1. Add your audio file to this directory
2. Start the development server: `npm run dev`
3. Click on the Fowler's Toad species on the map
4. Click the sound button (🔊) in the bottom-right of the 3D model area
5. The sound should play and the button should change to stop (🔇)

## Troubleshooting

- If you get an error, make sure the file is named exactly `12-Fowlers-Toad-Call.mp3`
- Check that the file is a valid audio format
- Ensure the file is not corrupted
- Try a different browser if audio doesn't play
