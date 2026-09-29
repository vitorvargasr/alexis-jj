import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, Calendar, Trophy, Sparkles } from 'lucide-react'
import { BeltTrack } from '@/components/rewards/BeltTrack'
import { WeeklyRoutine } from '@/components/rewards/WeeklyRoutine'
import { CourageCertificate } from '@/components/rewards/CourageCertificate'
import { Confetti } from '@/components/Confetti'
import { useMode } from '@/contexts/ModeContext'

type TabKey = 'belts' | 'weekly' | 'certificate'

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('belts')
  const [celebrating, setCelebrating] = useState(false)
  const { isKid } = useMode()

  const triggerCelebration = () => {
    setCelebrating(true)
    setTimeout(() => setCelebrating(false), 3000)
  }

  return (
    <div className="page rewards-page max-w-4xl mx-auto pb-12">
      {celebrating && <Confetti />}

      {/* Topo / Voltar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          to="/"
          className="back-link inline-flex items-center gap-1 font-bold text-amber-900 hover:text-amber-700"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o gibi
        </Link>
        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          {isKid ? 'Área de Conquistas do Álexis 🥋' : 'Painel de Recompensas'}
        </span>
      </div>

      {/* Hero com estética de gibi */}
      <header className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 sm:p-8 border-4 border-[#2D3748] shadow-[0_8px_0_#2D3748] mb-6 text-white overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Recompensas &amp; Rotina
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight drop-shadow-[0_2px_0_#9A3412]">
            Minhas Conquistas 🏆
          </h1>
          <p className="mt-2 text-white/95 font-semibold text-sm sm:text-base leading-snug">
            Acompanhe sua graduação com as 7 faixas de Jiu-Jitsu, marque seus dias de treino na
            semana e complete o gibi para imprimir seu Certificado de Lutador Corajoso!
          </p>
        </div>
      </header>

      {/* 3 Abas Principais (Botões grandes estilo gibi) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('belts')}
          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-3 border-[#2D3748] font-black text-sm sm:text-base uppercase tracking-wide transition-all shadow-md ${
            activeTab === 'belts'
              ? 'bg-[#E0592A] text-white shadow-[0_4px_0_#2D3748] scale-[1.02]'
              : 'bg-white text-slate-700 hover:bg-amber-50'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>1. Graduação de Casa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-3 border-[#2D3748] font-black text-sm sm:text-base uppercase tracking-wide transition-all shadow-md ${
            activeTab === 'weekly'
              ? 'bg-[#E0592A] text-white shadow-[0_4px_0_#2D3748] scale-[1.02]'
              : 'bg-white text-slate-700 hover:bg-amber-50'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>2. Semana de Treino</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-3 border-[#2D3748] font-black text-sm sm:text-base uppercase tracking-wide transition-all shadow-md ${
            activeTab === 'certificate'
              ? 'bg-[#E0592A] text-white shadow-[0_4px_0_#2D3748] scale-[1.02]'
              : 'bg-white text-slate-700 hover:bg-amber-50'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>3. Certificado Corajoso</span>
        </button>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="fade-rise">
        {activeTab === 'belts' && <BeltTrack onCelebration={triggerCelebration} />}
        {activeTab === 'weekly' && <WeeklyRoutine />}
        {activeTab === 'certificate' && <CourageCertificate />}
      </div>
    </div>
  )
}
