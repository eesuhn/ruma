'use client';

import { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const sampleNFTs = Array(20).fill('/sample-nft.svg?height=150&width=150');

export function NftSelection() {
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSelectedNFT(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNFTSelect = (nft: string) => {
    setSelectedNFT(nft);
  };

  const handleConfirm = () => {
    if (selectedNFT) {
      console.log('Selected NFT:', selectedNFT);
      // Here you would typically send this to your backend or NFT minting service
      alert('NFT selected and ready for minting!');
    } else {
      alert('Please select an NFT image first.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Event NFT</h1>
      <p className="mb-8 text-muted-foreground">
        Choose or upload an NFT image for your event attendees.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <Label htmlFor="nft-upload" className="block mb-2">
            Upload Custom NFT
          </Label>
          <Input
            id="nft-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer mb-4"
          />
          <Button onClick={handleConfirm} className="w-60">
            <Check className="mr-2 h-4 w-4" /> Confirm NFT Selection
          </Button>
        </div>

        {selectedNFT && (
          <div className="mt-[-120px]">
            <h2 className="text-xl font-semibold mb-4">Selected NFT Preview</h2>
            <img
              src={selectedNFT}
              alt="Selected NFT"
              className="max-w-full h-auto"
            />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4">NFT Collection</h2>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sampleNFTs.map((nft, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all ${
                selectedNFT === nft ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleNFTSelect(nft)}
            >
              <CardContent className="p-2">
                <img
                  src={nft}
                  alt={`Sample NFT ${index + 1}`}
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
