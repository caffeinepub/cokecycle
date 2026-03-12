import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterUser } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
}

export function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const register = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await register.mutateAsync(name.trim());
      toast.success("Welcome to CokeCycle! 🌱");
    } catch {
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="glass border-primary/20 max-w-md"
        data-ocid="profile_setup.dialog"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-display">
              Welcome to CokeCycle!
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Set up your recycling profile to start earning rewards and tracking
            your eco impact.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="display-name">Your Display Name</Label>
            <Input
              id="display-name"
              placeholder="e.g. EcoWarrior42"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted border-border"
              data-ocid="profile_setup.input"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-green"
            disabled={register.isPending || !name.trim()}
            data-ocid="profile_setup.submit_button"
          >
            {register.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up...
              </>
            ) : (
              "Start Recycling 🌱"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
