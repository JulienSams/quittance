import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getHistoryList, downloadHistoryZip, deleteHistoryItem } from '@/lib/history-storage'
import type { HistoryListItem } from '@/types/history'
import { Download, Trash2, Calendar, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function HistoryViewer() {
  const [history, setHistory] = useState<HistoryListItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadHistory = async () => {
    try {
      setLoading(true)
      const items = await getHistoryList()
      setHistory(items)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleDownload = async (id: string) => {
    try {
      await downloadHistoryZip(id)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Erreur lors du téléchargement')
    }
  }

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Supprimer la génération "${filename}" ?`)) {
      return
    }

    try {
      await deleteHistoryItem(id)
      await loadHistory()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-stone-500">
        Chargement de l'historique...
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4">
          <FileText className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-medium text-stone-900 mb-2">
          Aucun historique
        </h3>
        <p className="text-stone-500 font-light">
          Vos générations de quittances apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5 hover:border-teal-200 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {format(new Date(item.generatedAt), 'd MMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                  {item.nombreQuittances} quittance{item.nombreQuittances > 1 ? 's' : ''}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-stone-500 font-light">Propriétaire:</span>{' '}
                  <span className="text-stone-900">
                    {item.proprietaire.prenom} {item.proprietaire.nom}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 font-light">Locataire:</span>{' '}
                  <span className="text-stone-900">
                    {item.locataire.prenom} {item.locataire.nom}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 font-light">Période:</span>{' '}
                  <span className="text-stone-900">
                    {format(new Date(item.periode.debut), 'd MMM yyyy', { locale: fr })}
                    {' → '}
                    {format(new Date(item.periode.fin), 'd MMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => handleDownload(item.id)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger</span>
              </Button>
              <Button
                onClick={() => handleDelete(item.id, item.zipFilename)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
