import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Clock,
  QrCode,
  Recycle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useScanHistory, useSubmitScan } from "../hooks/useQueries";
import { useQRScanner } from "../qr-code/useQRScanner";

interface ScanResult {
  bottleId: string;
  pointsEarned: bigint;
}

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
}

export function ScanPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const submitScan = useSubmitScan();
  const { data: history, isLoading: historyLoading } = useScanHistory();

  const scanner = useQRScanner({
    facingMode: "environment",
    scanInterval: 200,
    maxResults: 1,
  });

  // Process QR scan result
  // biome-ignore lint/correctness/useExhaustiveDependencies: scanner functions are stable callbacks
  useEffect(() => {
    const latest = scanner.qrResults[0];
    if (!latest || processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);
    scanner.stopScanning();

    submitScan
      .mutateAsync(latest.data)
      .then((points) => {
        setScanResult({ bottleId: latest.data, pointsEarned: points });
      })
      .catch(() => {
        toast.error("Failed to register bottle. Please try again.");
      })
      .finally(() => {
        scanner.clearResults();
        processingRef.current = false;
        setProcessing(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanner.qrResults]);

  const handleStartScan = async () => {
    const ok = await scanner.startScanning();
    if (!ok) {
      toast.error(scanner.error?.message || "Could not access camera.");
    }
  };

  const handleStopScan = () => {
    scanner.stopScanning();
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-primary mb-4">
          <QrCode className="w-3.5 h-3.5" />
          QR Scanner
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Scan Your <span className="text-gradient-green">Bottle</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Point your camera at the QR code on your bottle to earn rewards
          instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl overflow-hidden">
            {/* Camera view */}
            <div className="relative aspect-video bg-muted/30">
              <video
                ref={scanner.videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={scanner.canvasRef} className="hidden" />

              {!scanner.isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Camera inactive
                  </p>
                </div>
              )}

              {scanner.isScanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary/60 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                    <div className="absolute inset-x-2 h-0.5 bg-primary/70 animate-bounce top-1/2" />
                  </div>
                </div>
              )}

              {processing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                    <p className="text-primary font-medium">
                      Registering bottle...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-5 flex items-center gap-3">
              {!scanner.isScanning ? (
                <Button
                  onClick={handleStartScan}
                  disabled={scanner.isLoading || processing}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="scan.primary_button"
                >
                  {scanner.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Scanning
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleStopScan}
                  variant="outline"
                  className="flex-1 border-secondary text-secondary"
                  data-ocid="scan.secondary_button"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Scanning
                </Button>
              )}
              {scanner.isScanning && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => scanner.switchCamera()}
                  data-ocid="scan.toggle"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>

            {scanner.error && (
              <div className="px-5 pb-5" data-ocid="scan.error_state">
                <div className="glass rounded-lg p-3 border border-secondary/30 text-secondary text-sm">
                  {scanner.error.message}. Please check camera permissions.
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 glass rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tip:</strong> Hold the QR
                code steady in the center of the camera frame. Good lighting
                helps for best results.
              </div>
            </div>
          </div>
        </div>

        {/* Scan History */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Scan History
          </h3>
          {historyLoading ? (
            <div className="space-y-3" data-ocid="scan.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : !history?.length ? (
            <div className="text-center py-10" data-ocid="scan.empty_state">
              <Recycle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No scans yet. Start recycling!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 10).map((record, i) => (
                <div
                  key={record.bottleId}
                  className="glass rounded-lg p-3"
                  data-ocid={`scan.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant="outline"
                      className="text-primary border-primary/30 text-xs"
                    >
                      +{record.pointsEarned.toString()} pts
                    </Badge>
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {record.bottleId}
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5">
                    {formatTime(record.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={!!scanResult} onOpenChange={() => setScanResult(null)}>
        <DialogContent
          className="glass border-primary/20 max-w-sm"
          data-ocid="scan.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Bottle Registered!
            </DialogTitle>
          </DialogHeader>
          {scanResult && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Bottle ID
                  </span>
                  <span className="font-mono text-xs text-foreground truncate max-w-32">
                    {scanResult.bottleId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Points Earned
                  </span>
                  <span className="font-display text-xl font-bold text-primary">
                    +{scanResult.pointsEarned.toString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Recycling Status
                  </span>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Verified ✓
                  </Badge>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                🌱 Bottle successfully registered. You earned{" "}
                <strong className="text-primary">
                  {scanResult.pointsEarned.toString()} reward points
                </strong>
                .
              </p>
              <Button
                className="w-full bg-primary text-primary-foreground"
                onClick={() => setScanResult(null)}
                data-ocid="scan.dialog.close_button"
              >
                Awesome! Keep Recycling
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
