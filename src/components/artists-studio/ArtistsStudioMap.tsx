'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Marker } from 'leaflet'
import { ArtistStudio } from '@/types/artistsStudio'

// Fix Leaflet default icon paths broken by webpack
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

type Props = {
  artists: ArtistStudio[]
  selectedArtistId: number | null
  onSelectArtist: (id: number) => void
}

export default function ArtistsStudioMap({ artists, selectedArtistId, onSelectArtist }: Props) {
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Map<number, Marker>>(new Map())
  const onSelectArtistRef = useRef(onSelectArtist)

  useEffect(() => {
    onSelectArtistRef.current = onSelectArtist
  }, [onSelectArtist])

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    let observer: MutationObserver | null = null

    import('leaflet').then((L) => {
      fixLeafletIcons()

      if (mapRef.current) return // Already initialized

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      const map = L.map('artists-studio-map', {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([46.603354, 1.888334], 6)

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      // Watch for theme changes and swap tile layer
      observer = new MutationObserver(() => {
        const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark'
        const newTileUrl = isDarkNow
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        map.eachLayer((layer) => {
          if ((layer as L.TileLayer).setUrl) {
            (layer as L.TileLayer).setUrl(newTileUrl)
          }
        })
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

      // Add markers
      artists.forEach((artist) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background-color: ${artist.color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2.5px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: transform 0.2s;
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const marker = L.marker([artist.lat, artist.lng], { icon })

        marker.bindPopup(`
          <div style="min-width:180px;font-family:inherit;">
            <img src="${artist.photo}" style="width:100%;height:72px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />
            <div style="font-weight:700;font-size:13px;">${artist.name}</div>
            <div style="font-size:11px;color:#b89c72;text-transform:uppercase;margin:2px 0;">${artist.medium}</div>
            <div style="font-size:11px;color:#666;">📍 ${artist.city}</div>
            <button
              onclick="window.__selectStudioArtist(${artist.id})"
              style="margin-top:8px;width:100%;background:#131313;color:#fff;border:none;padding:6px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;"
            >
              Voir l'atelier
            </button>
          </div>
        `)

        marker.addTo(map)
        markersRef.current.set(artist.id, marker)
      })

      // Expose global for popup button click
      ;(window as Window & { __selectStudioArtist?: (id: number) => void }).__selectStudioArtist =
        (id: number) => onSelectArtistRef.current(id)
    })

    return () => {
      observer?.disconnect()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current.clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pan to selected artist
  useEffect(() => {
    if (!mapRef.current || selectedArtistId === null) return
    const artist = artists.find((a) => a.id === selectedArtistId)
    if (artist) {
      mapRef.current.setView([artist.lat, artist.lng], 12, { animate: true })
      const marker = markersRef.current.get(selectedArtistId)
      if (marker) marker.openPopup()
    }
  }, [selectedArtistId, artists])

  return (
    <div
      id="artists-studio-map"
      className="h-full w-full z-10"
      style={{ minHeight: '420px' }}
    />
  )
}
