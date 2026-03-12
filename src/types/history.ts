export interface GenerationHistory {
  id: string
  generatedAt: Date
  proprietaire: {
    nom: string
    prenom: string
  }
  locataire: {
    nom: string
    prenom: string
  }
  periode: {
    debut: Date
    fin: Date
  }
  nombreQuittances: number
  zipBlob: Blob
  zipFilename: string
}

export interface HistoryListItem {
  id: string
  generatedAt: Date
  proprietaire: {
    nom: string
    prenom: string
  }
  locataire: {
    nom: string
    prenom: string
  }
  periode: {
    debut: Date
    fin: Date
  }
  nombreQuittances: number
  zipFilename: string
}
