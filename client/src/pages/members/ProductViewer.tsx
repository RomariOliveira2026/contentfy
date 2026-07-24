import { useParams } from "wouter";
import MembersLayout from "@/components/MembersLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Headphones,
  Download,
  FileText,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

export default function ProductViewer() {
  const { id } = useParams();
  const productId = parseInt(id || "0");

  const { data: productData, isLoading } = trpc.members.getMyProduct.useQuery(
    { productId },
    { enabled: productId > 0 }
  );

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <MembersLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </MembersLayout>
    );
  }

  if (!productData) {
    return (
      <MembersLayout>
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <p className="text-muted-foreground">
              Você não possui acesso a este produto ou ele não existe.
            </p>
          </CardContent>
        </Card>
      </MembersLayout>
    );
  }

  const { product } = productData;
  const isEbook = product?.type === "ebook";
  const isAudiobook = product?.type === "audiobook";

  return (
    <MembersLayout>
      <div className="space-y-6">
        {/* Header do Produto */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {isEbook ? (
                  <BookOpen className="w-8 h-8 text-primary" />
                ) : isAudiobook ? (
                  <Headphones className="w-8 h-8 text-primary" />
                ) : (
                  <FileText className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <Badge className="mb-2">
                  {isEbook ? "E-book" : isAudiobook ? "Audiobook" : "Produto Digital"}
                </Badge>
                <CardTitle className="text-2xl mb-2">{product?.name}</CardTitle>
                {product?.description && (
                  <p className="text-muted-foreground">{product.description}</p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* E-book Viewer */}
        {isEbook && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Visualizar E-book</CardTitle>
                {product?.contentUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={product.contentUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {product?.contentUrl ? (
                <div className="w-full" style={{ height: '80vh' }}>
                  <iframe
                    src={product.contentUrl}
                    className="w-full h-full rounded-lg border"
                    title={product.name}
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center p-8">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">E-book ainda não disponível</h3>
                    <p className="text-muted-foreground">
                      O arquivo será disponibilizado em breve.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Audiobook Player */}
        {isAudiobook && (
          <Card>
            <CardHeader>
              <CardTitle>Player de Áudio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Artwork Placeholder */}
                <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <Headphones className="w-24 h-24 text-primary/50" />
                </div>

                {/* Audio Element (hidden) */}
                <audio ref={audioRef} src={product?.contentUrl || ""} />

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => skip(-10)}
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    className="w-14 h-14"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => skip(10)}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={changePlaybackRate}
                  >
                    Velocidade: {playbackRate}x
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Áudio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre este Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                {product?.description ||
                  "Aproveite seu conteúdo digital a qualquer momento e em qualquer lugar."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MembersLayout>
  );
}
