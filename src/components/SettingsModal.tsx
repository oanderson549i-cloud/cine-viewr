import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getServerUrl, setServerUrl } from "@/lib/server-url";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
}

export function SettingsModal({ open, onOpenChange, onSaved }: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) setUrl(getServerUrl());
  }, [open]);

  const save = () => {
    setServerUrl(url.trim());
    onOpenChange(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Configurações do servidor</DialogTitle>
          <DialogDescription>
            Informe a URL pública do seu backend (ex: Cloudflare Tunnel).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="server-url">URL do servidor</Label>
          <Input
            id="server-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://meutunnel.trycloudflare.com"
            className="bg-secondary border-border"
          />
          <p className="text-xs text-muted-foreground">
            Salvo localmente no seu navegador.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save} disabled={!url.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
