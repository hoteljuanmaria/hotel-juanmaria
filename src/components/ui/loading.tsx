// components/Loading.js
import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center pt-20'>
      <div className='relative'>
        {/* Contenedor principal con glassmorphism */}
        <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-12 overflow-hidden'>
          {/* Orbes de fondo flotantes */}
          <div className='absolute -top-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse'></div>
          <div
            className='absolute -bottom-8 -right-8 w-24 h-24 bg-gray-200/10 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '0.5s' }}
          ></div>

          {/* Contenido del loading */}
          <div className='relative z-10 flex flex-col items-center space-y-6'>
            {/* Spinner principal con múltiples capas */}
            <div className='relative'>
              {/* Anillo exterior */}
              <div className='w-16 h-16 border-4 border-gray-200/30 rounded-full animate-spin'>
                <div
                  className='absolute inset-0 border-4 border-transparent border-t-gray-600 rounded-full animate-spin'
                  style={{ animationDuration: '1s' }}
                ></div>
              </div>

              {/* Anillo intermedio */}
              <div
                className='absolute inset-2 w-12 h-12 border-3 border-gray-300/20 rounded-full animate-spin'
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              >
                <div
                  className='absolute inset-0 border-3 border-transparent border-r-gray-700 rounded-full animate-spin'
                  style={{
                    animationDirection: 'reverse',
                    animationDuration: '1.5s',
                  }}
                ></div>
              </div>

              {/* Punto central */}
              <div className='absolute inset-6 w-4 h-4 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-full animate-pulse'></div>
            </div>

            {/* Texto elegante */}
            <div className='text-center'>
              <div className='font-serif text-xl text-gray-700 font-light mb-2'>
                Hotel Juan María
              </div>
              <div className='font-sans text-sm text-gray-500 font-medium tracking-wide'>
                Cargando experiencia de lujo...
              </div>
            </div>

            {/* Barra de progreso animada */}
            <div className='w-48 h-1 bg-gray-200/40 rounded-full overflow-hidden'>
              <div className='h-full bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-full animate-pulse transform origin-left'>
                <div className='h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'></div>
              </div>
            </div>
          </div>

          {/* Floating highlight */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-50 animate-pulse'></div>

          {/* Shimmer effects */}
          <div className='absolute inset-0 opacity-60'>
            <div className='absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse'></div>
            <div
              className='absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse'
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className='absolute top-8 left-8 w-2 h-2 bg-white/20 rounded-full animate-pulse'
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className='absolute bottom-8 right-8 w-1 h-1 bg-gray-400/30 rounded-full animate-pulse'
              style={{ animationDelay: '1.5s' }}
            ></div>
          </div>
        </div>

        {/* Sombra externa animada */}
        <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-5 rounded-xl blur-xl animate-pulse transform scale-110'></div>
      </div>
    </div>
  )
}

export default Loading
