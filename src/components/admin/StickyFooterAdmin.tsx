'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { 
  getAllStickyFooters, 
  createStickyFooter, 
  updateStickyFooter, 
  deleteStickyFooter,
  StickyFooterData 
} from '@/actions/stickyFooterActions'

interface StickyFooterFormData {
  activeOnAllPages: boolean
  activeOnSpecificPages: boolean
  specificPages: string[]
  endValidityDate: string
  title: string
  text: string
  textButton: string
  buttonUrl: string
}

const initialFormData: StickyFooterFormData = {
  activeOnAllPages: false,
  activeOnSpecificPages: false,
  specificPages: [],
  endValidityDate: '',
  title: '',
  text: '',
  textButton: '',
  buttonUrl: ''
}

export default function StickyFooterAdmin() {
  const [stickyFooters, setStickyFooters] = useState<StickyFooterData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<StickyFooterFormData>(initialFormData)

  useEffect(() => {
    loadStickyFooters()
  }, [])

  const loadStickyFooters = async () => {
    try {
      setIsLoading(true)
      const data = await getAllStickyFooters()
      setStickyFooters(data)
    } catch (error) {
      console.error('Erreur lors du chargement des sticky footers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        ...formData,
        endValidityDate: formData.endValidityDate ? new Date(formData.endValidityDate) : null,
        specificPages: formData.specificPages.filter(page => page.trim() !== '')
      }

      if (editingId) {
        await updateStickyFooter(editingId, data)
      } else {
        await createStickyFooter(data)
      }

      await loadStickyFooters()
      resetForm()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleEdit = (stickyFooter: StickyFooterData) => {
    setFormData({
      activeOnAllPages: stickyFooter.activeOnAllPages,
      activeOnSpecificPages: stickyFooter.activeOnSpecificPages,
      specificPages: stickyFooter.specificPages,
      endValidityDate: stickyFooter.endValidityDate 
        ? new Date(stickyFooter.endValidityDate).toISOString().split('T')[0]
        : '',
      title: stickyFooter.title || '',
      text: stickyFooter.text || '',
      textButton: stickyFooter.textButton || '',
      buttonUrl: stickyFooter.buttonUrl || ''
    })
    setEditingId(stickyFooter.id)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sticky footer ?')) {
      try {
        await deleteStickyFooter(id)
        await loadStickyFooters()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const addSpecificPage = () => {
    setFormData(prev => ({
      ...prev,
      specificPages: [...prev.specificPages, '']
    }))
  }

  const updateSpecificPage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      specificPages: prev.specificPages.map((page, i) => i === index ? value : page)
    }))
  }

  const removeSpecificPage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specificPages: prev.specificPages.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return <div className="p-4">Chargement...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Sticky Footers</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau Sticky Footer
        </button>
      </div>

      {/* Formulaire */}
      {isFormOpen && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Modifier' : 'Créer'} un Sticky Footer
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={formData.activeOnAllPages}
                    onChange={(e) => setFormData(prev => ({ ...prev, activeOnAllPages: e.target.checked }))}
                    className="mr-2"
                  />
                  Actif sur toutes les pages
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={formData.activeOnSpecificPages}
                    onChange={(e) => setFormData(prev => ({ ...prev, activeOnSpecificPages: e.target.checked }))}
                    className="mr-2"
                  />
                  Actif sur des pages spécifiques
                </label>
              </div>
            </div>

            {formData.activeOnSpecificPages && (
              <div>
                <label className="block text-sm font-medium mb-2">Pages spécifiques</label>
                {formData.specificPages.map((page, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={page}
                      onChange={(e) => updateSpecificPage(index, e.target.value)}
                      placeholder="Ex: root, artists, marketplace"
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecificPage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecificPage}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  + Ajouter une page
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Date de fin de validité (optionnel)</label>
              <input
                type="date"
                value={formData.endValidityDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endValidityDate: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Titre du sticky footer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Texte</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Texte descriptif"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Texte du bouton</label>
                <input
                  type="text"
                  value={formData.textButton}
                  onChange={(e) => setFormData(prev => ({ ...prev, textButton: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: En savoir plus"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL du bouton</label>
                <input
                  type="url"
                  value={formData.buttonUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://exemple.com"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des sticky footers */}
      <div className="space-y-4">
        {stickyFooters.map((stickyFooter) => (
          <div key={stickyFooter.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">
                    {stickyFooter.title || 'Sans titre'}
                  </h3>
                  <div className="flex gap-1">
                    {stickyFooter.activeOnAllPages && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        <Eye className="w-3 h-3 inline mr-1" />
                        Toutes pages
                      </span>
                    )}
                    {stickyFooter.activeOnSpecificPages && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        <EyeOff className="w-3 h-3 inline mr-1" />
                        Pages spécifiques
                      </span>
                    )}
                  </div>
                </div>
                
                {stickyFooter.text && (
                  <p className="text-gray-600 text-sm mb-2">{stickyFooter.text}</p>
                )}
                
                <div className="text-xs text-gray-500">
                  {stickyFooter.endValidityDate && (
                    <p>Valide jusqu&apos;au: {new Date(stickyFooter.endValidityDate).toLocaleDateString('fr-FR')}</p>
                  )}
                  {stickyFooter.specificPages.length > 0 && (
                    <p>Pages: {stickyFooter.specificPages.join(', ')}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(stickyFooter)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(stickyFooter.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {stickyFooters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun sticky footer configuré
          </div>
        )}
      </div>
    </div>
  )
}
