'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  const { t } = useTranslation()

  const paymentMethods = [
    { name: 'Papara', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM', min: '200₺' },
    { name: 'Jeton', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv96O1SbNqWATvQvL9l61h0u8wOp57jNAjFSVQAFYTrTo2HZqp6TzeA-RsvY9IBMO2jmezGHNDg0r0UBGKTozMLIkXQZo4k89DDK4R925SzIBZoX7IFIfWPM9y85U-DzzJHmvdJSwsq4XgxZ5_FpWKPD-vhK4WIz3UbvBrkOCVke5Wp8jlFJ9JdF_vAvWuMMG1OIrluFqn59xjqYgcApwSTwURRkPJmbWN1HEunMVTTwljV0qeTacLthvGA5ZeesL-OomL8hHzrcs', min: '200₺' },
    { name: 'Payfix', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4', min: '25₺' },
    { name: 'Aninda Papara', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM', min: '1₺' },
    { name: 'Hizli Papara', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM', min: '50₺' },
    { name: 'Aninda Havale', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4', min: '250₺' },
    { name: 'Banka Havalesi', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4', min: '250₺' },
    { name: 'MEFETE', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_QZPkcEwRgV2w29ueS8OBBJfim6_mPkVEjpxC1ArE5gg38siNYQu9zatW3xQjjNXElC6uaSnT_8wzIShR_bjRBdeN-JkpkWeV_pjXHkGH1ZrDibNf247kJoP-9QxR0QA2Zy2gIg0n4G_WqK1OUPjC3hnz9LRT4IhgBT0GTfkudTS38lm8peLtaiDaRCyiiGd2INgtFLy74hcenW-Fs65OXDh_-ICby-tcDeKe-KXlRyigL3OeYYWHGR6K31Z7sv189tPfFbglRtg', min: '20₺' },
  ]

  const gameProviders = [
    { name: 'Pragmatic Play', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3kwS4yyM7hQZ4Qf9EzLOPpWlojJppui1Gjv9a8q7EmCAYfGxS8LaMn9jRpKLwbcLY-BQ40DHVnaElyo7jHY0DE7v3V16kzdakcyLADBsAtCc8Jmaheg9ntYoYtCOexD_c2vltciWwFicWGdUlexOkhYB0wVz2iIY5dnXH04gxrUc9QiYDJ-_vyVGWEwaTN7mKGduSQ71r2iMfmXrAPrN7JMnnfiQrOZPoB9z3oIsrk1PxcoK9hp6iLP7jb6DBkgcxo-XSMUoIxUk' },
    { name: 'Amusnet', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPXSfIOH2zDcB7mCKHsxEv2BqCSqiSAt9_dfPw0cDd5c-zBHS8KCKOetJL2qg-DOZgoXz7_UuMNf3YQj8vquRCHLk5XP_6-PsSJawl2-gOd5Le_-NizI_uNGSS6SWPbGnB5zh2xm4sCp2KwTVwnSEE8ytIkWZaQNwFlf5ScG9vgymq4RVKzpdowc0sTSJ4IyddWme_fTE4m2iu5-Jg4rzgK58OQM8Ck9ZqyBRuyIMGFHEVwb0TvRtwmyFAQ2eFoxpqX1eBxwX5xBk' },
    { name: 'EGT Digital', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM' },
    { name: 'Hacksaw Gaming', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4' },
    { name: 'Evolution', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLViOFoCPPyIH92cUFJxjd9eQ7OK5lhwvXpJOVIaGjRgLOVhlBop6EC2HJaRfysVcPbHIfIH5QAbLMAaAjks3vJXhnTucNrRTPCkBOHiqy9jKVCE5y9Oa2d7yOM2bKr0YdSG1ivRPKfmMMTERUWiOLWh0HMIxWDPq8LFtaArBJHZuNdLfuyf4FRGIzh6o5OmY1wNghWYSRHQvjE4T-3gt8caWVEasL_BJFrJ4YYBNWC81GTl_hbJvur6q9C1Q5-erfmJ5Aufi8uxE' },
    { name: 'Ezugi', logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA2VZQxDW8ohkuCpe0yXlCQ-WwyzFV_0UgNWe0q6-d-mFqS9IYxLNVYGP1l0ZgF_OsK7WbSTKvP6-rMGb36qMLsQF4RtFA9-fuQhXzgeMCoK5P7JwObTL7C--5K4RI5icxiJdWQW9_97lU1em5U6-V4KTzcXpJbAaXf2pm-P7EMXgUao6CpbOZboJ2s1vFF8onp_HfRatKgjBfjynB76i8xmHfoWmyvOYUnLl8QWLw1rYAlrgEW1GMx2I-XPZhk5bhzzUqbQ54DmY' },
  ]

  const gameCategories = [
    { title: 'SPOR BAHİSLERİ', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFdt_egz5gHLlu-FTOvLZ6GGptOc1EJj71POiCjeDrnMJjkzMvosLXXgK5hUf531IsvMXp6RHYJ_UG6va5bWKdRw7cipUb2LpBgEYuCbIw8YzVmblbTkKs1cjRkNEdU52NUIc1soBkGcFx5u_RvSBouV9UJ5Lj0hirahoJTQHTQk5JMYK77pvjnIFdGy3Yfzo-pZLkCFGgUDmsaW4SdPst-LML4p1l7bymtZx_-CR08BXhFn8aK0aM1oIqjCr-F4NoFFC2wYqaZI' },
    { title: 'CANLI CASINO', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLViOFoCPPyIH92cUFJxjd9eQ7OK5lhwvXpJOVIaGjRgLOVhlBop6EC2HJaRfysVcPbHIfIH5QAbLMAaAjks3vJXhnTucNrRTPCkBOHiqy9jKVCE5y9Oa2d7yOM2bKr0YdSG1ivRPKfmMMTERUWiOLWh0HMIxWDPq8LFtaArBJHZuNdLfuyf4FRGIzh6o5OmY1wNghWYSRHQvjE4T-3gt8caWVEasL_BJFrJ4YYBNWC81GTl_hbJvur6q9C1Q5-erfmJ5Aufi8uxE' },
    { title: 'SLOT OYUNLARI', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8qmSEpnangbZPsEjVrL4-T_QPnQkwNw-hEeOmBbriCBPZ0rAdek9_QXP3OxhpJ4TT1Vv-sFc9RtkrNVz9okC-aMPyaeFOghAFXTt0ggedS8eftCzprVzWRuleHIcF8813i6rAJ1Ef8s0yzVx3TbeeaVLXcLBvLkt-jpxGRC4e7fSDs-pKcyTVXvmCSqAqkKGxFsznPC_WtVn-pl4HY-lYn6vFERfeOA4G3uX_-npkmhkZ8b242jMomzQMvGI35c1jqJFlNcMCqCY' },
    { title: 'SANAL SPORLAR', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPNLqQFPxRhlnwXsXC31ZpGayc1URQmJHAaKr6iVluWvhIARqkjLtDSu0eXi8SMabkf3FiWO2qwjEwPmWJUjY_wjlFpFXr55SvTDz_eV3LaZ6arpNvKYFAhb9OZSOtKsxyiC-tY3VJI9PuGw8TeDIJe4hLUHNLwypPvCMbicRAn49H03QwEOaEvJZ1TzxqjZ2dPT7wSgMYZhSZlBGG1szQ9c0dFP5Z6nwgbNE1CXVAVdvXa2b0rzPf1npQqAypXFeW1SWa1rrNJU' },
    { title: 'CRASH OYUNLARI', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxL1mseMlK2-RLOjovS4IIJ0pwn3Nvdm_yIiJltXUeUrWycM84O2-syNPpKZ4QoyXyLmqRmsdts_-Crvliv3zi5_DabbcAGW5_i1oZTRAFUKy0FJDHiNsM_XDdwAiCKz-VTEVjK6IL4_eHbK1Uavg71T2aS7BRPUiKr6ylEEvKe4jpgb3TauZzHWPFju1QBLhy49KoC5l67zEAZdYC3GMcDvMatAW3YSX79vAwNP6NgkW-l-NOj4a4xZZvm7eCwS7W4kF42-dDTA' },
  ]

  const trendingGames = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxL1mseMlK2-RLOjovS4IIJ0pwn3Nvdm_yIiJltXUeUrWycM84O2-syNPpKZ4QoyXyLmqRmsdts_-Crvliv3zi5_DabbcAGW5_i1oZTRAFUKy0FJDHiNsM_XDdwAiCKz-VTEVjK6IL4_eHbK1Uavg71T2aS7BRPUiKr6ylEEvKe4jpgb3TauZzHWPFju1QBLhy49KoC5l67zEAZdYC3GMcDvMatAW3YSX79vAwNP6NgkW-l-NOj4a4xZZvm7eCwS7W4kF42-dDTA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA8qmSEpnangbZPsEjVrL4-T_QPnQkwNw-hEeOmBbriCBPZ0rAdek9_QXP3OxhpJ4TT1Vv-sFc9RtkrNVz9okC-aMPyaeFOghAFXTt0ggedS8eftCzprVzWRuleHIcF8813i6rAJ1Ef8s0yzVx3TbeeaVLXcLBvLkt-jpxGRC4e7fSDs-pKcyTVXvmCSqAqkKGxFsznPC_WtVn-pl4HY-lYn6vFERfeOA4G3uX_-npkmhkZ8b242jMomzQMvGI35c1jqJFlNcMCqCY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA8qmSEpnangbZPsEjVrL4-T_QPnQkwNw-hEeOmBbriCBPZ0rAdek9_QXP3OxhpJ4TT1Vv-sFc9RtkrNVz9okC-aMPyaeFOghAFXTt0ggedS8eftCzprVzWRuleHIcF8813i6rAJ1Ef8s0yzVx3TbeeaVLXcLBvLkt-jpxGRC4e7fSDs-pKcyTVXvmCSqAqkKGxFsznPC_WtVn-pl4HY-lYn6vFERfeOA4G3uX_-npkmhkZ8b242jMomzQMvGI35c1jqJFlNcMCqCY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgxL1mseMlK2-RLOjovS4IIJ0pwn3Nvdm_yIiJltXUeUrWycM84O2-syNPpKZ4QoyXyLmqRmsdts_-Crvliv3zi5_DabbcAGW5_i1oZTRAFUKy0FJDHiNsM_XDdwAiCKz-VTEVjK6IL4_eHbK1Uavg71T2aS7BRPUiKr6ylEEvKe4jpgb3TauZzHWPFju1QBLhy49KoC5l67zEAZdYC3GMcDvMatAW3YSX79vAwNP6NgkW-l-NOj4a4xZZvm7eCwS7W4kF42-dDTA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBNWaCaCf4c9Drk0eLzT_NxjtLxoAc6cJZKa8ouzrfcHv9rGAkEWplyTFgpWnmb76nxq203ofQT91RX0IVmi7KTJQIOo67bg28rUiDtClodMGuK-ejlGFgP3fW4kEpp53NhodsjlaoMIhtuj5LvpvN6yEIAfX2NMb0X5rxiLrMGhAUL4RKXo4agx8c-M7lY_30e9-C2J8Vmgt_lVKfnVF-aVHmJC6zPSxKb0Pn93x_ptBIFPvid2O6EFafRct1JEkt5b9JMlMJ1b8U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBA2VZQxDW8ohkuCpe0yXlCQ-WwyzFV_0UgNWe0q6-d-mFqS9IYxLNVYGP1l0ZgF_OsK7WbSTKvP6-rMGb36qMLsQF4RtFA9-fuQhXzgeMCoK5P7JwObTL7C--5K4RI5icxiJdWQW9_97lU1em5U6-V4KTzcXpJbAaXf2pm-P7EMXgUao6CpbOZboJ2s1vFF8onp_HfRatKgjBfjynB76i8xmHfoWmyvOYUnLl8QWLw1rYAlrgEW1GMx2I-XPZhk5bhzzUqbQ54DmY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCLViOFoCPPyIH92cUFJxjd9eQ7OK5lhwvXpJOVIaGjRgLOVhlBop6EC2HJaRfysVcPbHIfIH5QAbLMAaAjks3vJXhnTucNrRTPCkBOHiqy9jKVCE5y9Oa2d7yOM2bKr0YdSG1ivRPKfmMMTERUWiOLWh0HMIxWDPq8LFtaArBJHZuNdLfuyf4FRGIzh6o5OmY1wNghWYSRHQvjE4T-3gt8caWVEasL_BJFrJ4YYBNWC81GTl_hbJvur6q9C1Q5-erfmJ5Aufi8uxE',
  ]

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#151328]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">
            <Navbar />

            <main className="flex-1">
              {/* Hero Banner */}
              <div className="px-4 sm:px-6 lg:px-8 py-10">
                <div 
                  className="flex min-h-[360px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-lg items-start justify-center p-8 md:p-12 text-left"
                  style={{
                    backgroundImage: `linear-gradient(90deg, rgba(21, 19, 40, 0.9) 0%, rgba(21, 19, 40, 0.1) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCCaW01L4T3L4vB9SKeAiplpugvMelUYglA8Ys4HZnsgqE866WX7EuR44XBlYYC6CB1GWt2OMC0T8xwxGdg3x99VyETmtUmgSRIb0zWF-OTHr-VeeLaRVqskQMO8hhKZPUkZr33eBFaKOs5mSKft1l-b-xVMwQPyjyrma0B3tqB8FZG3eF1JMs5IADQcqI1iUJ8GDkOGFm80w9pEV85nfxxFX11q67jhbbW3r1x_e9XwFAqr9YAlGB6oKVOSxz1bLm69LvclLXRrHY")`
                  }}
                >
                  <div className="flex flex-col gap-4 max-w-md">
                <p className="text-white text-sm font-bold uppercase tracking-widest">{t('home.superPartnership')}</p>
                <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">{t('home.earningsOpportunity')}</h1>
                <button className="flex min-w-[84px] max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-white text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-all">
                  <span className="truncate">{t('home.details')}</span>
                </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-3 rounded-md bg-[#1f1d37] border border-white/10">
                      <img alt={`${method.name} logo`} className="h-8" src={method.logo} />
                      <p className="text-white/70 text-xs">{t('home.minDeposit')}</p>
                      <p className="text-white font-bold text-sm">{method.min}</p>
                      <button className="w-full rounded h-7 bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">{t('home.depositNow')}</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Providers */}
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {gameProviders.map((provider, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 p-4 rounded-md bg-[#1f1d37] border border-white/10">
                      <img alt={`${provider.name} Logo`} className="h-12" src={provider.logo} />
                      <button className="w-full rounded h-7 bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors">OYUNLARA GİT</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Games */}
              <div className="px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="text-white text-lg font-bold mb-4">{t('home.featuredGames')}</h2>
                <div className="bg-[#1f1d37] rounded-lg p-4">
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-yellow-400">19 KASIM</p>
                      <p className="text-sm text-white">23:00</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-white">ARSENAL (W)</p>
                      <p className="text-sm text-white/70">vs</p>
                      <p className="text-sm font-bold text-white">REAL MADRID (W)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="bg-green-500 rounded-md px-4 py-2 text-white font-bold text-sm hover:bg-green-600">ŞİMDİ OYNA</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <p className="text-xs text-white/60">{t('home.winners')}</p>
                    <div className="flex gap-2">
                      <button className="bg-gray-800 text-white px-8 py-2 rounded-md text-sm">1 <span className="font-bold ml-2">1.55</span></button>
                      <button className="bg-gray-800 text-white px-8 py-2 rounded-md text-sm">X <span className="font-bold ml-2">3.85</span></button>
                      <button className="bg-gray-800 text-white px-8 py-2 rounded-md text-sm">2 <span className="font-bold ml-2">4.83</span></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-white/60">Champions League - KADINLAR $.LIGI</p>
                        <span className="text-xs text-white/60">+205</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>FK Anda Kencifali</span>
                        <span>Draw</span>
                        <span>CSKA 1948 Sofia</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">2.14</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">3.04</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">2.12</button>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-white/60">First League</p>
                        <span className="text-xs text-white/60">+205</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>Süper Lig</span>
                        <span>Draw</span>
                        <span>Gaziantep FK</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">2.42</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">2.88</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">3.48</button>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-white/60">First League</p>
                        <span className="text-xs text-white/60">+205</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>Cherno More Varna</span>
                        <span>Draw</span>
                        <span>Lokomotiv Sofia</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">1.49</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">3.31</button>
                        <button className="bg-gray-800 text-white py-2 rounded-md text-sm">4.40</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Categories */}
              <div className="px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {gameCategories.map((category, index) => {
                    const getCategoryLink = (title) => {
                      if (title === 'SPOR BAHİSLERİ') return '/sports'
                      if (title === 'CANLI CASINO') return '/live-casino'
                      if (title === 'SLOT OYUNLARI') return '/slots'
                      if (title === 'CRASH OYUNLARI') return '/crash'
                      return '#'
                    }
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center p-6 rounded-lg bg-cover bg-center text-center gap-4"
                        style={{
                          backgroundImage: `linear-gradient(rgba(21, 19, 40, 0.7), rgba(21, 19, 40, 0.7)), url("${category.image}")`
                        }}
                      >
                        <h2 className="text-white text-xl font-bold">{category.title}</h2>
                        <Link href={getCategoryLink(category.title)} className="bg-white/90 text-black text-sm font-bold px-5 py-2 rounded-md hover:bg-white">ŞİMDİ OYNA</Link>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Trending Section */}
              <div className="py-10">
                <h2 className="text-white text-lg font-bold px-4 sm:px-6 lg:px-8 pb-4">{t('home.trending')}</h2>
                <div className="relative">
                  <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-4">
                    <div className="flex items-stretch px-4 sm:px-6 lg:px-8 gap-4">
                      {trendingGames.map((game, index) => (
                        <div key={index} className="flex flex-col rounded-lg bg-surface-dark shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-w-[160px] group overflow-hidden">
                          <img alt={`Game art ${index + 1}`} className="w-full aspect-[4/3] object-cover" src={game} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="px-4 sm:px-6 lg:px-8 py-10 bg-[#1f1d37] mt-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-white mb-4">HELP</h3>
                    <ul className="space-y-2">
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/help/faq">F.A.Q</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/help/payment-options">Payment options</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/help/contact">Contact Us</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">ABOUT US</h3>
                    <ul className="space-y-2">
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/about/bonus-rules">General Bonus Rules</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/about/responsible-gaming">Responsible Gaming</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/about/privacy-policy">Privacy Policy</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">TERMS AND CONDITIONS</h3>
                    <ul className="space-y-2">
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/terms/general">General Terms and Conditions</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/terms/sports-betting">Sports Betting Rules</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">STATISTICS</h3>
                    <ul className="space-y-2">
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/stats/results">Results</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/stats/statistics">Statistics</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-4">PROMOTIONS</h3>
                    <ul className="space-y-2">
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/promotions?category=sports">Sport Bonus</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/promotions?category=casino">Casino Bonus</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/promotions?category=freespin">Free Spin Bonus</Link></li>
                      <li><Link className="text-sm text-white/70 hover:text-white" href="/promotions?category=general">General Bonus</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-center font-bold text-white mb-6">REGULATIONS &amp; PARTNERS</h3>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 opacity-70">
                    <img alt="MaksiPara Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3kwS4yyM7hQZ4Qf9EzLOPpWlojJppui1Gjv9a8q7EmCAYfGxS8LaMn9jRpKLwbcLY-BQ40DHVnaElyo7jHY0DE7v3V16kzdakcyLADBsAtCc8Jmaheg9ntYoYtCOexD_c2vltciWwFicWGdUlexOkhYB0wVz2iIY5dnXH04gxrUc9QiYDJ-_vyVGWEwaTN7mKGduSQ71r2iMfmXrAPrN7JMnnfiQrOZPoB9z3oIsrk1PxcoK9hp6iLP7jb6DBkgcxo-XSMUoIxUk" />
                    <img alt="Aninda Havale Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4" />
                    <img alt="Envoy Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPXSfIOH2zDcB7mCKHsxEv2BqCSqiSAt9_dfPw0cDd5c-zBHS8KCKOetJL2qg-DOZgoXz7_UuMNf3YQj8vquRCHLk5XP_6-PsSJawl2-gOd5Le_-NizI_uNGSS6SWPbGnB5zh2xm4sCp2KwTVwnSEE8ytIkWZaQNwFlf5ScG9vgymq4RVKzpdowc0sTSJ4IyddWme_fTE4m2iu5-Jg4rzgK58OQM8Ck9ZqyBRuyIMGFHEVwb0TvRtwmyFAQ2eFoxpqX1eBxwX5xBk" />
                    <img alt="Jeton Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv96O1SbNqWATvQvL9l61h0u8wOp57jNAjFSVQAFYTrTo2HZqp6TzeA-RsvY9IBMO2jmezGHNDg0r0UBGKTozMLIkXQZo4k89DDK4R925SzIBZoX7IFIfWPM9y85U-DzzJHmvdJSwsq4XgxZ5_FpWKPD-vhK4WIz3UbvBrkOCVke5Wp8jlFJ9JdF_vAvWuMMG1OIrluFqn59xjqYgcApwSTwURRkPJmbWN1HEunMVTTwljV0qeTacLthvGA5ZeesL-OomL8hHzrcs" />
                    <img alt="Papara Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM" />
                    <img alt="MEFETE Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_QZPkcEwRgV2w29ueS8OBBJfim6_mPkVEjpxC1ArE5gg38siNYQu9zatW3xQjjNXElC6uaSnT_8wzIShR_bjRBdeN-JkpkWeV_pjXHkGH1ZrDibNf247kJoP-9QxR0QA2Zy2gIg0n4G_WqK1OUPjC3hnz9LRT4IhgBT0GTfkudTS38lm8peLtaiDaRCyiiGd2INgtFLy74hcenW-Fs65OXDh_-ICby-tcDeKe-KXlRyigL3OeYYWHGR6K31Z7sv189tPfFbglRtg" />
                    <img alt="Aninda Kredi Karti Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3kwS4yyM7hQZ4Qf9EzLOPpWlojJppui1Gjv9a8q7EmCAYfGxS8LaMn9jRpKLwbcLY-BQ40DHVnaElyo7jHY0DE7v3V16kzdakcyLADBsAtCc8Jmaheg9ntYoYtCOexD_c2vltciWwFicWGdUlexOkhYB0wVz2iIY5dnXH04gxrUc9QiYDJ-_vyVGWEwaTN7mKGduSQ71r2iMfmXrAPrN7JMnnfiQrOZPoB9z3oIsrk1PxcoK9hp6iLP7jb6DBkgcxo-XSMUoIxUk" />
                    <img alt="Bitcoin Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_QZPkcEwRgV2w29ueS8OBBJfim6_mPkVEjpxC1ArE5gg38siNYQu9zatW3xQjjNXElC6uaSnT_8wzIShR_bjRBdeN-JkpkWeV_pjXHkGH1ZrDibNf247kJoP-9QxR0QA2Zy2gIg0n4G_WqK1OUPjC3hnz9LRT4IhgBT0GTfkudTS38lm8peLtaiDaRCyiiGd2INgtFLy74hcenW-Fs65OXDh_-ICby-tcDeKe-KXlRyigL3OeYYWHGR6K31Z7sv189tPfFbglRtg" />
                    <img alt="FastCash Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPXSfIOH2zDcB7mCKHsxEv2BqCSqiSAt9_dfPw0cDd5c-zBHS8KCKOetJL2qg-DOZgoXz7_UuMNf3YQj8vquRCHLk5XP_6-PsSJawl2-gOd5Le_-NizI_uNGSS6SWPbGnB5zh2xm4sCp2KwTVwnSEE8ytIkWZaQNwFlf5ScG9vgymq4RVKzpdowc0sTSJ4IyddWme_fTE4m2iu5-Jg4rzgK58OQM8Ck9ZqyBRuyIMGFHEVwb0TvRtwmyFAQ2eFoxpqX1eBxwX5xBk" />
                    <img alt="Payfix Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRLnCRDbvF49AdXxAytYRof2OBbII4_iVQGoCJJQG-KSAPj__dGcqYXdW4RSsKISR1NEcyxIGYb_rMuR8AnLwSN4GGNm0da23s9F61Tw24Oa1pnmctKIZe_3NGTkz8waCrbqBXJoHdTxWCN4kwrLFqYUdOEbCwXQBNhhkeWpHzckt8gqLEGh6uApxucdhfzlILsqTAYUae46wc2MGsbm6GI7YXSv_OtOtha68q_Ls4z4jI-pAqhFKocJFT0UA6QcLTfdw1sNJjQy4" />
                    <img alt="PeP Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv96O1SbNqWATvQvL9l61h0u8wOp57jNAjFSVQAFYTrTo2HZqp6TzeA-RsvY9IBMO2jmezGHNDg0r0UBGKTozMLIkXQZo4k89DDK4R925SzIBZoX7IFIfWPM9y85U-DzzJHmvdJSwsq4XgxZ5_FpWKPD-vhK4WIz3UbvBrkOCVke5Wp8jlFJ9JdF_vAvWuMMG1OIrluFqn59xjqYgcApwSTwURRkPJmbWN1HEunMVTTwljV0qeTacLthvGA5ZeesL-OomL8hHzrcs" />
                    <img alt="Paycell Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM" />
                    <img alt="Aninda Papara Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrUOWIw-W1huRgXhguTyN9rXCVw-1rQqWcmcb5Kb9qURdaMi2B-4k6WdQJlltVW8HJaBz_kBD5l93hKYoeMVgHM13a4EAIEWQDidbhEHah4jXewTtIxb9zZeOIBJ7r0rpQdHTAI8ol0cSKRvx84dYjhDlEBCWIuTfrW0RFQUOSA43iOSOUJhiLTZWqpvdWwg64zg3Q6bWKTouX77aKaOtVhx34KZH9-tcY9KLsLCeen4hAr3fE-b08WysDtEIuApiJ9gr9LLZ5USM" />
                    <img alt="Tosla Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPXSfIOH2zDcB7mCKHsxEv2BqCSqiSAt9_dfPw0cDd5c-zBHS8KCKOetJL2qg-DOZgoXz7_UuMNf3YQj8vquRCHLk5XP_6-PsSJawl2-gOd5Le_-NizI_uNGSS6SWPbGnB5zh2xm4sCp2KwTVwnSEE8ytIkWZaQNwFlf5ScG9vgymq4RVKzpdowc0sTSJ4IyddWme_fTE4m2iu5-Jg4rzgK58OQM8Ck9ZqyBRuyIMGFHEVwb0TvRtwmyFAQ2eFoxpqX1eBxwX5xBk" />
                    <img alt="RocketPay Logo" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv96O1SbNqWATvQvL9l61h0u8wOp57jNAjFSVQAFYTrTo2HZqp6TzeA-RsvY9IBMO2jmezGHNDg0r0UBGKTozMLIkXQZo4k89DDK4R925SzIBZoX7IFIfWPM9y85U-DzzJHmvdJSwsq4XgxZ5_FpWKPD-vhK4WIz3UbvBrkOCVke5Wp8jlFJ9JdF_vAvWuMMG1OIrluFqn59xjqYgcApwSTwURRkPJmbWN1HEunMVTTwljV0qeTacLthvGA5ZeesL-OomL8hHzrcs" />
        </div>
      </div>
              </footer>
    </main>
          </div>
        </div>
      </div>
    </div>
  )
}
