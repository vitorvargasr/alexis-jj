import { useState } from 'react'
import { BookOpen, LogOut, Mail, Menu, Settings, UserRound } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { EmailChangeDialog } from '@/components/EmailChangeDialog'
import { ModeToggle } from '@/components/ModeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import { useLibrary } from '@/contexts/LibraryContext'
import { useMode } from '@/contexts/ModeContext'
import { progressPercentage } from '@/lib/belts'
import pb from '@/lib/pocketbase/client'

function BeltRail({ percentage }: { percentage: number }) {
  const colors = ['#F7F5EA', '#326DA8', '#7650A8', '#7A4E35', '#252525']
  return (
    <aside className="belt-rail" aria-label={`Progresso da faixa: ${percentage}%`}>
      <span className="rail-label">Jornada</span>
      <div className="rail-track">
        {colors.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
        <i style={{ height: `${100 - percentage}%` }} />
      </div>
      <strong>{percentage}%</strong>
    </aside>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const { isKid } = useMode()
  const { posters, progress } = useLibrary()
  const [emailOpen, setEmailOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const learned = progress.filter((item) => item.learned).length
  const percentage = progressPercentage(learned, posters.length)
  const avatarUrl = user?.avatar
    ? pb.files.getURL(user, user.avatar as string, { thumb: '100x100' })
    : ''
  const initials = String(user?.name || 'Pai do Álexis')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  const signOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={isKid ? 'app-shell kid-mode' : 'app-shell dad-mode'}>
      <header className="topbar">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Ir para o início">
            <span className="brand-mark">📖</span>
            <span>
              Gibi do <strong>Álexis</strong>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <NavLink to="/" end>
              <BookOpen /> Histórias do Gibi
            </NavLink>
            {!isKid && (
              <NavLink to="/gerenciar">
                <Settings /> Gerenciar Gibi
              </NavLink>
            )}
          </nav>
          <div className="header-actions">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="avatar-trigger" aria-label="Abrir menu do papai">
                <Avatar>
                  <AvatarImage src={avatarUrl} alt="Foto do papai" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="profile-menu">
                <DropdownMenuLabel>
                  <span>{String(user?.name || 'Pai do Álexis')}</span>
                  <small>{String(user?.email || '')}</small>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                  <UserRound /> Meu perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEmailOpen(true)}>
                  <Mail /> Trocar email
                </DropdownMenuItem>
                {!isKid && (
                  <DropdownMenuItem onClick={() => navigate('/gerenciar')}>
                    <Settings /> Gerenciar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="danger-menu-item">
                  <LogOut /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger className="mobile-menu-trigger" aria-label="Abrir navegação">
                <Menu />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Jiu-Jitsu do Álexis</SheetTitle>
                </SheetHeader>
                <nav className="mobile-nav">
                  <NavLink to="/">
                    <BookOpen /> Histórias do Gibi
                  </NavLink>
                  {!isKid && (
                    <NavLink to="/gerenciar">
                      <Settings /> Gerenciar Gibi
                    </NavLink>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
      {!isKid && (
        <footer>
          Feito com carinho para o Álexis <span>·</span> versão 1.0
        </footer>
      )}
      {isKid && <BeltRail percentage={percentage} />}

      <EmailChangeDialog open={emailOpen} onOpenChange={setEmailOpen} />
      <DialogProfile
        open={profileOpen}
        onOpenChange={setProfileOpen}
        name={String(user?.name || '')}
        email={String(user?.email || '')}
      />
    </div>
  )
}

function DialogProfile({
  open,
  onOpenChange,
  name,
  email,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  email: string
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Meu perfil</SheetTitle>
        </SheetHeader>
        <div className="profile-sheet">
          <div className="profile-big-avatar">👨‍👦</div>
          <div>
            <span>Nome</span>
            <strong>{name || 'Pai do Álexis'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{email}</strong>
          </div>
          <p>
            Este é o acesso da família. O Modo Criança usa a mesma conta, sem mostrar as ferramentas
            do papai.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
