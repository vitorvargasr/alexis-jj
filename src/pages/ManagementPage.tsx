import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Edit3,
  FileImage,
  FolderPlus,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { FormField, TextArea, TextInput } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLibrary } from '@/contexts/LibraryContext'
import { extractFieldErrors, getErrorMessage, type FieldErrors } from '@/lib/pocketbase/errors'
import {
  chapterCoverUrl,
  removeChapter,
  saveChapter,
  updateChapterOrder,
} from '@/services/chapters'
import { posterImageUrl, removePoster, savePoster } from '@/services/posters'
import type { Chapter, Poster } from '@/types/library'

interface ChapterDraft {
  title: string
  description: string
  emoji: string
  order: number
  cover: File | null
}

interface PosterDraft {
  title: string
  kid_text: string
  dad_tip: string
  chapter: string
  order: number
  image: File | null
}

const emptyChapter = (order: number): ChapterDraft => ({
  title: '',
  description: '',
  emoji: '🥋',
  order,
  cover: null,
})
const emptyPoster = (chapter: string, order: number): PosterDraft => ({
  title: '',
  kid_text: '',
  dad_tip: '',
  chapter,
  order,
  image: null,
})

export default function ManagementPage() {
  const { chapters, posters, reload } = useLibrary()
  const [chapterFormOpen, setChapterFormOpen] = useState(false)
  const [chapterEditing, setChapterEditing] = useState<Chapter | null>(null)
  const [posterEditing, setPosterEditing] = useState<Poster | null>(null)
  const [posterChapter, setPosterChapter] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'chapter' | 'poster'
    id: string
    title: string
  } | null>(null)
  const [busy, setBusy] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const reorder = async (chapter: Chapter, delta: number) => {
    const currentIndex = chapters.findIndex((item) => item.id === chapter.id)
    const other = chapters[currentIndex + delta]
    if (!other) return
    setBusy(true)
    try {
      await Promise.all([
        updateChapterOrder(chapter.id, other.order),
        updateChapterOrder(other.id, chapter.order),
      ])
      await reload()
    } catch (error) {
      setGlobalError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setBusy(true)
    try {
      if (deleteTarget.type === 'chapter') await removeChapter(deleteTarget.id)
      else await removePoster(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    } catch (error) {
      setGlobalError(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page management-page">
      <Link to="/" className="back-link">
        <ArrowLeft /> Voltar para a biblioteca
      </Link>
      <header className="management-hero fade-rise">
        <div>
          <span className="eyebrow">Estúdio do papai</span>
          <h1>Gerenciar a biblioteca</h1>
          <p>Organize os capítulos, escreva dicas e envie novas ilustrações para o Álexis.</p>
        </div>
        <Button
          onClick={() => {
            setChapterEditing(null)
            setChapterFormOpen(true)
          }}
        >
          <FolderPlus /> Novo capítulo
        </Button>
      </header>

      {globalError && (
        <div className="global-error" role="alert">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError('')}>
            <X />
          </button>
        </div>
      )}

      <section className="studio-summary">
        <div>
          <strong>{chapters.length}</strong>
          <span>capítulos</span>
        </div>
        <div>
          <strong>{posters.length}</strong>
          <span>pôsteres</span>
        </div>
        <div>
          <strong>
            {posters.filter((poster) => poster.image || posterImageUrl(poster)).length}
          </strong>
          <span>com ilustração</span>
        </div>
      </section>

      <div className="management-list">
        {chapters.map((chapter, chapterIndex) => {
          const chapterPosters = posters
            .filter((poster) => poster.chapter === chapter.id)
            .sort((a, b) => a.order - b.order)
          const cover = chapterCoverUrl(chapter)
          return (
            <section
              key={chapter.id}
              className="manage-chapter fade-rise"
              style={{ animationDelay: `${chapterIndex * 60}ms` }}
            >
              <header className="manage-chapter-header">
                <div className="manage-chapter-cover">
                  {cover ? <img src={cover} alt="" /> : <span>{chapter.emoji || '🥋'}</span>}
                </div>
                <div className="manage-chapter-title">
                  <span>Capítulo {chapterIndex + 1}</span>
                  <h2>{chapter.title.replace(/^Capítulo \d+\s*—\s*/, '')}</h2>
                  <p>{chapter.description || 'Sem descrição.'}</p>
                </div>
                <div className="manage-actions">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => reorder(chapter, -1)}
                    disabled={chapterIndex === 0 || busy}
                    aria-label="Mover capítulo para cima"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => reorder(chapter, 1)}
                    disabled={chapterIndex === chapters.length - 1 || busy}
                    aria-label="Mover capítulo para baixo"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setChapterEditing(chapter)
                      setChapterFormOpen(true)
                    }}
                  >
                    <Edit3 /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="danger-button"
                    onClick={() =>
                      setDeleteTarget({ type: 'chapter', id: chapter.id, title: chapter.title })
                    }
                  >
                    <Trash2 />
                    <span className="desktop-button-label">Excluir</span>
                  </Button>
                </div>
              </header>

              <div className="manage-posters">
                <div className="manage-posters-heading">
                  <h3>
                    Pôsteres <span>{chapterPosters.length}</span>
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPosterEditing(null)
                      setPosterChapter(chapter.id)
                    }}
                  >
                    <Plus /> Novo pôster
                  </Button>
                </div>
                {chapterPosters.length ? (
                  chapterPosters.map((poster, posterIndex) => {
                    const art = posterImageUrl(poster, '480x0')
                    return (
                      <article key={poster.id} className="manage-poster-row">
                        <div className="manage-poster-image">
                          {art ? <img src={art} alt="" /> : <FileImage />}
                          <span>{posterIndex + 1}</span>
                        </div>
                        <div className="manage-poster-copy">
                          <strong>{poster.title}</strong>
                          <span>{art ? 'Ilustração pronta' : 'Aguardando ilustração'}</span>
                        </div>
                        <div className="manage-actions">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setPosterEditing(poster)
                              setPosterChapter(chapter.id)
                            }}
                          >
                            <Edit3 /> Editar
                          </Button>
                          <Button
                            variant="ghost"
                            className="danger-button"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'poster',
                                id: poster.id,
                                title: poster.title,
                              })
                            }
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </article>
                    )
                  })
                ) : (
                  <div className="manage-empty">
                    <ImagePlus />
                    <p>Nenhum pôster neste capítulo.</p>
                    <Button variant="link" onClick={() => setPosterChapter(chapter.id)}>
                      Adicionar o primeiro
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <ChapterFormDialog
        open={chapterFormOpen}
        chapter={chapterEditing}
        nextOrder={chapters.length + 1}
        onClose={() => setChapterFormOpen(false)}
        onSaved={reload}
      />
      <PosterFormDialog
        open={Boolean(posterChapter)}
        poster={posterEditing}
        initialChapter={posterChapter || ''}
        chapters={chapters}
        nextOrder={posters.filter((poster) => poster.chapter === posterChapter).length + 1}
        onClose={() => setPosterChapter(null)}
        onSaved={reload}
      />
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="dialog-icon danger">
              <Trash2 />
            </div>
            <DialogTitle>
              Excluir {deleteTarget?.type === 'chapter' ? 'capítulo' : 'pôster'}?
            </DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title}” será removido.{' '}
              {deleteTarget?.type === 'chapter' &&
                'Todos os pôsteres e progressos deste capítulo também serão excluídos.'}{' '}
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button className="delete-confirm" onClick={confirmDelete} disabled={busy}>
              {busy ? 'Excluindo...' : 'Sim, excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ChapterFormDialog({
  open,
  chapter,
  nextOrder,
  onClose,
  onSaved,
}: {
  open: boolean
  chapter: Chapter | null
  nextOrder: number
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const initial = useMemo<ChapterDraft>(
    () =>
      chapter
        ? {
            title: chapter.title,
            description: chapter.description,
            emoji: chapter.emoji,
            order: chapter.order,
            cover: null,
          }
        : emptyChapter(nextOrder),
    [chapter, nextOrder, open],
  )
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!open) return
    setDraft(initial)
    setErrors({})
    setPreview('')
  }, [initial, open])

  const close = () => {
    setDraft(initial)
    setErrors({})
    setPreview('')
    onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const local: FieldErrors = {}
    if (!draft.title.trim()) local.title = 'Informe o título do capítulo.'
    if (draft.title.length > 120) local.title = 'Use no máximo 120 caracteres.'
    if (draft.description.length > 500) local.description = 'Use no máximo 500 caracteres.'
    if (draft.emoji.length > 8) local.emoji = 'Use somente um emoji curto.'
    if (Object.keys(local).length) {
      setErrors(local)
      return
    }
    setBusy(true)
    try {
      await saveChapter(draft, chapter?.id)
      await onSaved()
      close()
    } catch (error) {
      setErrors({ ...extractFieldErrors(error), form: getErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && close()}>
      <DialogContent className="form-dialog">
        <DialogHeader>
          <DialogTitle>{chapter ? 'Editar capítulo' : 'Novo capítulo'}</DialogTitle>
          <DialogDescription>Crie uma etapa clara na jornada do Álexis.</DialogDescription>
        </DialogHeader>
        <form className="studio-form" onSubmit={submit}>
          {errors.form && <div className="global-error">{errors.form}</div>}
          <div className="form-row narrow-wide">
            <FormField label="Emoji" error={errors.emoji}>
              <TextInput
                value={draft.emoji}
                onChange={(event) => setDraft({ ...draft, emoji: event.target.value })}
                maxLength={8}
              />
            </FormField>
            <FormField label="Título" error={errors.title}>
              <TextInput
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                placeholder="Ex.: Capítulo 5 — Raspagens"
              />
            </FormField>
          </div>
          <FormField
            label="Descrição"
            error={errors.description}
            hint={`${draft.description.length}/500 caracteres`}
          >
            <TextArea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              rows={3}
            />
          </FormField>
          <div className="form-row">
            <FormField label="Ordem" error={errors.order}>
              <TextInput
                type="number"
                min={1}
                value={draft.order}
                onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
              />
            </FormField>
            <FormField
              label="Capa do capítulo"
              error={errors.cover}
              hint="PNG, JPG ou WebP · até 5 MB"
            >
              <label className="file-input">
                <ImagePlus />
                <span>{draft.cover?.name || 'Escolher imagem'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setDraft({ ...draft, cover: file })
                    if (file) setPreview(URL.createObjectURL(file))
                  }}
                />
              </label>
            </FormField>
          </div>
          {(preview || (chapter && chapterCoverUrl(chapter))) && (
            <img
              className="upload-preview cover-preview"
              src={preview || chapterCoverUrl(chapter!)}
              alt="Prévia da capa"
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              <Save /> {busy ? 'Salvando...' : 'Salvar capítulo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PosterFormDialog({
  open,
  poster,
  initialChapter,
  chapters,
  nextOrder,
  onClose,
  onSaved,
}: {
  open: boolean
  poster: Poster | null
  initialChapter: string
  chapters: Chapter[]
  nextOrder: number
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const initial = useMemo<PosterDraft>(
    () =>
      poster
        ? {
            title: poster.title,
            kid_text: poster.kid_text,
            dad_tip: poster.dad_tip,
            chapter: poster.chapter,
            order: poster.order,
            image: null,
          }
        : emptyPoster(initialChapter, nextOrder),
    [poster, initialChapter, nextOrder, open],
  )
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    if (!open) return
    setDraft(initial)
    setErrors({})
    setPreview('')
  }, [initial, open])

  const close = () => {
    setDraft(initial)
    setErrors({})
    setPreview('')
    onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const local: FieldErrors = {}
    if (!draft.title.trim()) local.title = 'Informe o título do pôster.'
    if (!draft.chapter) local.chapter = 'Escolha um capítulo.'
    if (draft.title.length > 120) local.title = 'Use no máximo 120 caracteres.'
    if (draft.kid_text.length > 400) local.kid_text = 'Use no máximo 400 caracteres.'
    if (draft.dad_tip.length > 1000) local.dad_tip = 'Use no máximo 1000 caracteres.'
    if (draft.image && draft.image.size > 10 * 1024 * 1024)
      local.image = 'A imagem precisa ter no máximo 10 MB.'
    if (Object.keys(local).length) {
      setErrors(local)
      return
    }
    setBusy(true)
    try {
      await savePoster(draft, poster?.id)
      await onSaved()
      close()
    } catch (error) {
      setErrors({ ...extractFieldErrors(error), form: getErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  const existingArt = poster ? posterImageUrl(poster) : ''
  return (
    <Dialog open={open} onOpenChange={(value) => !value && close()}>
      <DialogContent className="form-dialog poster-form-dialog">
        <DialogHeader>
          <DialogTitle>{poster ? 'Editar pôster' : 'Novo pôster'}</DialogTitle>
          <DialogDescription>
            Adicione a arte e as duas formas de conversar sobre o movimento.
          </DialogDescription>
        </DialogHeader>
        <form className="studio-form" onSubmit={submit}>
          {errors.form && <div className="global-error">{errors.form}</div>}
          <FormField label="Título" error={errors.title}>
            <TextInput
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Ex.: Raspagem Tesoura"
            />
          </FormField>
          <div className="form-row">
            <FormField label="Capítulo" error={errors.chapter}>
              <select
                className="text-input"
                value={draft.chapter}
                onChange={(event) => setDraft({ ...draft, chapter: event.target.value })}
              >
                <option value="">Escolha um capítulo</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Ordem" error={errors.order}>
              <TextInput
                type="number"
                min={1}
                value={draft.order}
                onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
              />
            </FormField>
          </div>
          <FormField
            label="Texto para o Álexis"
            error={errors.kid_text}
            hint={`${draft.kid_text.length}/400 caracteres`}
          >
            <TextArea
              value={draft.kid_text}
              onChange={(event) => setDraft({ ...draft, kid_text: event.target.value })}
              rows={3}
              placeholder="Uma frase divertida, simples e segura."
            />
          </FormField>
          <FormField
            label="Dica PARA O PAI"
            error={errors.dad_tip}
            hint={`${draft.dad_tip.length}/1000 caracteres`}
          >
            <TextArea
              value={draft.dad_tip}
              onChange={(event) => setDraft({ ...draft, dad_tip: event.target.value })}
              rows={4}
              placeholder="Explique como orientar e o que observar durante o treino."
            />
          </FormField>
          <FormField label="Ilustração" error={errors.image} hint="PNG, JPG ou WebP · até 10 MB">
            <label className="file-drop">
              <ImagePlus />
              <strong>
                {draft.image?.name || (existingArt ? 'Trocar ilustração' : 'Escolher ilustração')}
              </strong>
              <span>Toque para procurar o arquivo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setDraft({ ...draft, image: file })
                  if (file) setPreview(URL.createObjectURL(file))
                }}
              />
            </label>
          </FormField>
          {(preview || existingArt) && (
            <img
              className="upload-preview poster-preview"
              src={preview || existingArt}
              alt="Prévia da ilustração"
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              <Save /> {busy ? 'Salvando...' : 'Salvar pôster'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
