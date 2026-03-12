import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { listConfigs, configExists } from '@/lib/config-storage'
import type { ConfigListItem } from '@/types/config'
import { Save, FolderOpen, Trash2 } from 'lucide-react'

interface ConfigManagerProps {
  onSave: (name: string) => void
  onLoad: (name: string) => void
  onDelete: (name: string) => void
}

export function ConfigManager({ onSave, onLoad, onDelete }: ConfigManagerProps) {
  const [configs, setConfigs] = useState<ConfigListItem[]>([])
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [configName, setConfigName] = useState('')
  const [error, setError] = useState('')

  const refreshConfigs = () => {
    setConfigs(listConfigs())
  }

  useEffect(() => {
    refreshConfigs()
  }, [])

  const handleSave = () => {
    setError('')
    const name = configName.trim()

    if (!name) {
      setError('Veuillez entrer un nom')
      return
    }

    if (configExists(name)) {
      if (!confirm(`La configuration "${name}" existe déjà. Voulez-vous la remplacer ?`)) {
        return
      }
    }

    onSave(name)
    setConfigName('')
    setSaveDialogOpen(false)
    refreshConfigs()
  }

  const handleLoad = (name: string) => {
    onLoad(name)
    setLoadDialogOpen(false)
  }

  const handleDelete = (name: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la configuration "${name}" ?`)) {
      onDelete(name)
      refreshConfigs()
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder la configuration
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sauvegarder la configuration</DialogTitle>
            <DialogDescription>
              Donnez un nom à cette configuration pour la retrouver facilement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="config-name">Nom de la configuration</Label>
              <Input
                id="config-name"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Ex: Appartement Paris, Villa Lyon..."
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Charger une configuration
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Charger une configuration</DialogTitle>
            <DialogDescription>
              Sélectionnez une configuration à charger. Les données actuelles seront remplacées.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {configs.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-8">
                Aucune configuration sauvegardée
              </p>
            ) : (
              <div className="space-y-2">
                {configs.map((config) => (
                  <div
                    key={config.name}
                    className="flex items-center justify-between p-3 border border-stone-200 rounded hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{config.name}</p>
                      <p className="text-xs text-stone-500">
                        {config.savedAt.toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(config.name)}
                      >
                        Charger
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(config.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
