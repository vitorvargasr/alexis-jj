import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Edit3,
  FileImage,
  Flame,
  FolderPlus,
  ImagePlus,
  Plus,
  Save,
  Sparkles,
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
import { Award, BookOpen } from 'lucide-react'
import { PosterArtwork } from '@/components/PosterArtwork'
import { DadRewardsPanel } from '@/components/rewards/DadRewardsPanel'
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
  caption: string
  kind: 'historia' | 'posicao'
  kid_text: string
  dad_tip: string
  chapter: string
  order: number
  image: File | null
}

const emptyChapter = (order: number): ChapterDraft => ({
  title: '',
  description: '',
  emoji: '📖',
  order,
  cover: null,
})
const emptyPoster = (chapter: string, order: number): PosterDraft => ({
  title: '',
  caption: '',
  kind: 'historia',
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
  const [mainTab, setMainTab] = useState<'comics' | 'rewards'>('comics')

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
        <ArrowLeft /> Voltar para o gibi
      </Link>
      <header className="management-hero fade-rise">
        <div>
          <span className="eyebrow">Estúdio do Gibi</span>
          <h1>Gerenciar Histórias e Quadrinhos</h1>
          <p>
            Crie edições da revista, adicione quadros da rotina do Álexis e ensine posições de
            Jiu-Jitsu no fluxo narrativo.
          </p>
        </div>
        <Button
          onClick={() => {
            setChapterEditing(null)
            setChapterFormOpen(true)
          }}
        >
          <FolderPlus /> Nova história / edição
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
          <span>histórias/edições</span>
        </div>
        <div>
          <strong>{posters.length}</strong>
          <span>quadros no total</span>
        </div>
        <div>
          <strong>
            {posters.filter((poster) => poster.image || posterImageUrl(poster)).length}
          </strong>
          <span>com arte ilustrada</span>
        </div>
      </section>

      {/* Abas do Gerenciador: Gibi vs Recompensas */}
      <div className="flex gap-2 mb-6 border-b-2 border-slate-200 pb-2">
        <Button
          variant={mainTab === 'comics' ? 'default' : 'outline'}
          onClick={() => setMainTab('comics')}
          className="gap-2 font-bold"
        >
          <BookOpen className="w-4 h-4" /> Histórias &amp; Quadros do Gibi
        </Button>
        <Button
          variant={mainTab === 'rewards' ? 'default' : 'outline'}
          onClick={() => setMainTab('rewards')}
          className="gap-2 font-bold bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 data-[state=active]:bg-amber-500"
        >
          <Award className="w-4 h-4" /> Recompensas &amp; Graduação
        </Button>
      </div>

      {mainTab === 'rewards' ? (
        <DadRewardsPanel />
      ) : (
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
                    {cover ? <img src={cover} alt="" /> : <span>{chapter.emoji || '📖'}</span>}
                  </div>
                  <div className="manage-chapter-title">
                    <span>Edição #{chapterIndex + 1}</span>
                    <h2>
                      {chapter.title
                        .replace(/^Edição \d+\s*—\s*/, '')
                        .replace(/^Capítulo \d+\s*—\s*/, '')}
                    </h2>
                    <p>{chapter.description || 'Sem descrição.'}</p>
                  </div>
                  <div className="manage-actions">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => reorder(chapter, -1)}
                      disabled={chapterIndex === 0 || busy}
                      aria-label="Mover história para cima"
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => reorder(chapter, 1)}
                      disabled={chapterIndex === chapters.length - 1 || busy}
                      aria-label="Mover história para baixo"
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
                      <Edit3 /> Editar história
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
                      Quadros da história <span>{chapterPosters.length}</span>
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPosterEditing(null)
                        setPosterChapter(chapter.id)
                      }}
                    >
                      <Plus /> Novo quadro
                    </Button>
                  </div>
                  {chapterPosters.length ? (
                    chapterPosters.map((poster, posterIndex) => {
                      const art = posterImageUrl(poster, '480x0')
                      const isPosicao = poster.kind === 'posicao'
                      return (
                        <article key={poster.id} className="manage-poster-row">
                          <div className="manage-poster-image">
                            {art ? (
                              <img src={art} alt="" />
                            ) : (
                              <PosterArtwork poster={poster} thumb="480x0" compact />
                            )}
                            <span>{posterIndex + 1}</span>
                          </div>
                          <div className="manage-poster-copy">
                            <strong>{poster.title}</strong>
                            <span className="manage-poster-meta">
                              <span className="badge-kind">
                                {isPosicao ? '🥋 Posição' : '📖 História'}
                              </span>
                              <span>
                                {art || poster.title ? 'Arte ilustrada' : 'Aguardando arte'}
                              </span>
                              {poster.caption && (
                                <span className="caption-preview">“{poster.caption}”</span>
                              )}
                            </span>
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
                      <p>Nenhum quadro nesta história ainda.</p>
                      <Button variant="link" onClick={() => setPosterChapter(chapter.id)}>
                        Adicionar o primeiro quadro
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}

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
              Excluir {deleteTarget?.type === 'chapter' ? 'história' : 'quadro'}?
            </DialogTitle>
            <DialogDescription>
              “{deleteTarget?.title}” será removido.{' '}
              {deleteTarget?.type === 'chapter' &&
                'Todos os quadros e progressos desta história também serão excluídos.'}{' '}
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
    if (!draft.title.trim()) local.title = 'Informe o título da história.'
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
          <DialogTitle>
            {chapter ? 'Editar história / edição' : 'Nova história / edição'}
          </DialogTitle>
          <DialogDescription>Crie uma aventura em quadrinhos para o Álexis.</DialogDescription>
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
            <FormField label="Título da Edição" error={errors.title}>
              <TextInput
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                placeholder="Ex.: Edição 1 — O Dia a Dia no Tatame"
              />
            </FormField>
          </div>
          <FormField
            label="Sinopse / Descrição da História"
            error={errors.description}
            hint={`${draft.description.length}/500 caracteres`}
          >
            <TextArea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              rows={3}
              placeholder="O que o Álexis e seu amigo de treino vão viver e aprender nesta história?"
            />
          </FormField>
          <div className="form-row">
            <FormField label="Ordem da Edição" error={errors.order}>
              <TextInput
                type="number"
                min={1}
                value={draft.order}
                onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
              />
            </FormField>
            <FormField
              label="Capa da Edição"
              error={errors.cover}
              hint="PNG, JPG ou WebP · até 5 MB"
            >
              <label className="file-input">
                <ImagePlus />
                <span>{draft.cover?.name || 'Escolher capa'}</span>
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
              <Save /> {busy ? 'Salvando...' : 'Salvar história'}
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
            caption: poster.caption || '',
            kind: (poster.kind as 'historia' | 'posicao') || 'historia',
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
    if (!draft.title.trim()) local.title = 'Informe o título do quadro.'
    if (!draft.chapter) local.chapter = 'Escolha uma história.'
    if (draft.title.length > 120) local.title = 'Use no máximo 120 caracteres.'
    if (draft.caption.length > 400) local.caption = 'Use no máximo 400 caracteres na legenda.'
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
          <DialogTitle>{poster ? 'Editar quadro do gibi' : 'Novo quadro do gibi'}</DialogTitle>
          <DialogDescription>
            Defina o tipo do quadro (história do dia a dia ou posição ensinada), envie a ilustração
            e escreva a legenda estilo gibi.
          </DialogDescription>
        </DialogHeader>
        <form className="studio-form" onSubmit={submit}>
          {errors.form && <div className="global-error">{errors.form}</div>}
          <FormField label="Título do Quadro" error={errors.title}>
            <TextInput
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Ex.: Montada Alta ou O Cumprimento com o Léo"
            />
          </FormField>

          <div className="form-row">
            <FormField label="Tipo do Quadro">
              <select
                className="text-input"
                value={draft.kind}
                onChange={(event) =>
                  setDraft({ ...draft, kind: event.target.value as 'historia' | 'posicao' })
                }
              >
                <option value="historia">📖 História (dia a dia / narrativa)</option>
                <option value="posicao">🥋 Posição (técnica de Jiu-Jitsu)</option>
              </select>
            </FormField>
            <FormField label="História / Edição" error={errors.chapter}>
              <select
                className="text-input"
                value={draft.chapter}
                onChange={(event) => setDraft({ ...draft, chapter: event.target.value })}
              >
                <option value="">Escolha uma história</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Ordem (página)" error={errors.order}>
              <TextInput
                type="number"
                min={1}
                value={draft.order}
                onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })}
              />
            </FormField>
          </div>

          <FormField
            label="Legenda do Gibi (faixa amarela de narração)"
            error={errors.caption}
            hint={`${draft.caption.length}/400 caracteres · Narração da cena estilo gibi`}
          >
            <TextArea
              value={draft.caption}
              onChange={(event) => setDraft({ ...draft, caption: event.target.value })}
              rows={2}
              placeholder="Ex.: No sábado de manhã, Álexis amarra a faixa ansioso para encontrar o amigo Léo no tatame..."
            />
          </FormField>

          <FormField
            label="Fala no balão (para o Álexis)"
            error={errors.kid_text}
            hint={`${draft.kid_text.length}/400 caracteres · O que o papai ou personagens dizem`}
          >
            <TextArea
              value={draft.kid_text}
              onChange={(event) => setDraft({ ...draft, kid_text: event.target.value })}
              rows={2}
              placeholder="Ex.: Proteja os braços, mexa o quadril e crie espaço para voltar a defender!"
            />
          </FormField>

          <FormField
            label="Orientação PARA O PAPAI (100% oculta no Modo Criança)"
            error={errors.dad_tip}
            hint={`${draft.dad_tip.length}/1000 caracteres`}
          >
            <TextArea
              value={draft.dad_tip}
              onChange={(event) => setDraft({ ...draft, dad_tip: event.target.value })}
              rows={3}
              placeholder="Explique o que observar no treino, postura correta e como elogiar o filho com segurança."
            />
          </FormField>

          <FormField
            label="Ilustração do Quadro"
            error={errors.image}
            hint="PNG, JPG, WebP ou SVG · até 10 MB"
          >
            <label className="file-drop">
              <ImagePlus />
              <strong>
                {draft.image?.name || (existingArt ? 'Trocar ilustração' : 'Escolher ilustração')}
              </strong>
              <span>Toque para selecionar a arte enviada</span>
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
              alt="Prévia da ilustração do quadrinho"
            />
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              <Save /> {busy ? 'Salvando...' : 'Salvar quadro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
