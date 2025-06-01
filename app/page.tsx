'use client';

import { useState, ChangeEvent } from "react";
import axios from "axios";
import { Upload, Download, Image as ImageIcon, Sparkles, History, Settings, Palette, Camera, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ original: string; colorized: string; timestamp: Date }>>([]);
  const [highQuality, setHighQuality] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("colorize");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setColorizedImage(null);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", image);
    // Add quality setting to the request
    formData.append("high_quality", highQuality.toString());

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await axios.post<Blob>("http://127.0.0.1:8000/colorize", formData, {
        responseType: "blob",
      });

      clearInterval(progressInterval);
      setProgress(100);

      const imageUrl = URL.createObjectURL(response.data);
      setColorizedImage(imageUrl);
      
      // Only add to history if auto-save is enabled
      if (autoSave) {
        setHistory(prev => [{
          original: preview!,
          colorized: imageUrl,
          timestamp: new Date()
        }, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
    setLoading(false);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGalleryClick = () => {
    setActiveTab("history");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0A] text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-gradient" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 md:mb-6">
              <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/10 text-purple-400 text-xs md:text-sm font-medium border border-purple-500/20">
                AI-Powered Image Colorization
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Breathe Life into Your Photos
            </h1>
            <p className={`text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-2xl mx-auto px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Transform your black and white memories into vibrant, colorized masterpieces using our advanced AI technology
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 md:px-8 py-4 md:py-6 rounded-xl text-base md:text-lg font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40">
                <Camera className="mr-2 h-5 w-5" />
                Start Colorizing
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-purple-500/20 text-purple-400 hover:bg-purple-500/10 px-6 md:px-8 py-4 md:py-6 rounded-xl text-base md:text-lg font-medium transition-all duration-300"
                onClick={handleGalleryClick}
              >
                <Palette className="mr-2 h-5 w-5" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
          <TabsList className={`grid w-full grid-cols-3 mb-8 md:mb-12 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100'} p-1 rounded-2xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <TabsTrigger value="colorize" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-xl text-sm md:text-base">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Colorize</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-xl text-sm md:text-base">
              <History className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-xl text-sm md:text-base">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colorize">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Upload Section */}
              <Card className={`p-4 md:p-6 lg:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl backdrop-blur-sm`}>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                      <ImageIcon className={`h-5 w-5 md:h-6 md:w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <h2 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Upload Image
                    </h2>
                  </div>
                  
                  <div className={`border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-xl p-6 md:p-8 text-center hover:border-purple-500/50 transition-colors ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="p-3 md:p-4 rounded-full bg-purple-500/10 mb-4">
                        <Upload className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
                      </div>
                      <span className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Click to upload or drag and drop
                      </span>
                      <span className={`text-xs md:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                        PNG, JPG up to 10MB
                      </span>
                    </label>
                  </div>

                  {preview && (
                    <div className="mt-4 md:mt-6">
                      <img
                        src={preview}
                        alt="Original"
                        className="w-full h-48 md:h-64 lg:h-72 object-cover rounded-xl shadow-lg shadow-purple-500/10"
                      />
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 md:py-6 rounded-xl text-base md:text-lg font-medium shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40"
                        onClick={handleUpload}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            Colorize Image
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Result Section */}
              <Card className={`p-4 md:p-6 lg:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl backdrop-blur-sm`}>
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                      <Sparkles className={`h-5 w-5 md:h-6 md:w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <h2 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Colorized Result
                    </h2>
                  </div>

                  <div className={`border ${darkMode ? 'border-gray-800' : 'border-gray-200'} rounded-xl h-48 md:h-64 lg:h-72 flex items-center justify-center ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    {loading ? (
                      <div className="text-center w-full px-4">
                        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <Progress value={progress} className="mb-2 bg-gray-800" />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Processing image...</p>
                      </div>
                    ) : colorizedImage ? (
                      <img
                        src={colorizedImage}
                        alt="Colorized"
                        className="w-full h-full object-cover rounded-xl shadow-lg shadow-blue-500/10"
                      />
                    ) : (
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Colorized image will appear here
                      </p>
                    )}
                  </div>

                  {colorizedImage && (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 md:py-6 rounded-xl text-base md:text-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = colorizedImage;
                        link.download = 'colorized-image.jpg';
                        link.click();
                      }}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Colorized Image
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className={`p-4 md:p-6 lg:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                  <History className={`h-5 w-5 md:h-6 md:w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h2 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Colorizations
                </h2>
              </div>
              
              {history.length > 0 ? (
                <div className="grid gap-4 md:gap-6">
                  {history.map((item, index) => (
                    <div key={index} className={`flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'} rounded-xl border hover:border-purple-500/50 transition-colors`}>
                      <div className="flex-1">
                        <img src={item.original} alt="Original" className="w-full h-32 md:h-40 object-cover rounded-lg shadow-lg shadow-purple-500/10" />
                      </div>
                      <div className="flex-1">
                        <img src={item.colorized} alt="Colorized" className="w-full h-32 md:h-40 object-cover rounded-lg shadow-lg shadow-blue-500/10" />
                      </div>
                      <div className="flex flex-row sm:flex-col justify-between sm:justify-center gap-4">
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {item.timestamp.toLocaleDateString()}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.colorized;
                            link.download = 'colorized-image.jpg';
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'} py-8 md:py-12`}>
                  No colorization history yet
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className={`p-4 md:p-6 lg:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                  <Settings className={`h-5 w-5 md:h-6 md:w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <h2 className={`text-xl md:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'} rounded-xl border`}>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>High Quality Output</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Get the best possible colorization quality</p>
                  </div>
                  <Switch 
                    checked={highQuality}
                    onCheckedChange={setHighQuality}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'} rounded-xl border`}>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Auto-save Results</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Automatically save colorized images to history</p>
                  </div>
                  <Switch 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'} rounded-xl border`}>
                  <div>
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Dark Mode</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Switch between light and dark themes</p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 md:mt-24 lg:mt-32 text-center">
          <div className="inline-block mb-4 md:mb-6">
            <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-500/10 text-purple-400 text-xs md:text-sm font-medium border border-purple-500/20">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Experience the Future of Image Colorization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className={`p-6 md:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl border hover:border-purple-500/50 transition-colors`}>
              <div className="h-12 w-12 md:h-14 md:w-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mx-auto mb-4 md:mb-6">
                <Sparkles className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Advanced AI</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Powered by state-of-the-art deep learning models for accurate colorization
              </p>
            </div>
            <div className={`p-6 md:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl border hover:border-purple-500/50 transition-colors`}>
              <div className="h-12 w-12 md:h-14 md:w-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4 md:mb-6">
                <ImageIcon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>High Quality</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get high-resolution colorized images with natural-looking colors
              </p>
            </div>
            <div className={`p-6 md:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-2xl border hover:border-purple-500/50 transition-colors`}>
              <div className="h-12 w-12 md:h-14 md:w-14 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mx-auto mb-4 md:mb-6">
                <Download className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-3 md:mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Easy Download</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Download your colorized images instantly in various formats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
