# AI Image Colorization

A modern web application that uses AI to colorize black and white images. Built with Next.js, FastAPI, and Caffe.

![Image Colorization Demo](https://github.com/snehapm04/Image-Coloriser/blob/master/public/demo.gif)

## Features

- 🎨 AI-powered image colorization
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 📂 Image history tracking
- ⚡ High-quality output options
- 💾 Auto-save functionality
- 📥 Easy download of colorized images

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Lucide Icons

- **Backend:**
  - FastAPI
  - Caffe (for AI model)
  - Python 3.8+

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snehapm04/Image-Coloriser.git
   cd Image-Coloriser
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

4. **Download the AI model:**
   - Download the colorization model file (`colorization_release_v2.caffemodel`) from [here](http://eecs.berkeley.edu/~rich.zhang/projects/2016_colorization/files/demo_v2/colorization_release_v2.caffemodel)
   - Place it in the `server` directory

## Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   uvicorn main:app --reload
   ```

2. **Start the frontend development server:**
   ```bash
   # In a new terminal
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload an Image:**
   - Click the upload area or drag and drop a black and white image
   - Supported formats: JPG, PNG
   - Maximum file size: 10MB

2. **Colorize:**
   - Click the "Colorize Image" button
   - Wait for the AI to process your image
   - View the colorized result

3. **Download:**
   - Click the "Download" button to save your colorized image

4. **Settings:**
   - Toggle high-quality output
   - Enable/disable auto-save
   - Switch between dark and light modes

## Project Structure

```
Image-Coloriser/
├── app/                 # Next.js application
├── components/          # React components
├── lib/                 # Utility functions
├── public/             # Static assets
├── server/             # FastAPI backend
│   ├── main.py         # Server code
│   └── models/         # AI model files
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
