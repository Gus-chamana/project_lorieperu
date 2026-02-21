export default function FloralDecoration() {
  return (
    <>
      {/* Decoración floral izquierda */}
      <div className="fixed left-0 top-1/4 w-32 h-96 pointer-events-none z-0 opacity-15">
        <img
          src="https://readdy.ai/api/search-image?query=delicate%20botanical%20floral%20branch%20illustration%20with%20small%20flowers%20and%20leaves%2C%20vertical%20arrangement%2C%20soft%20beige%20and%20brown%20tones%2C%20minimalist%20elegant%20design%2C%20watercolor%20style%2C%20feminine%20aesthetic%2C%20simple%20line%20art%2C%20decorative%20element%2C%20transparent%20background%20style&width=200&height=600&seq=floral-left-decoration&orientation=portrait"
          alt="Decoración floral izquierda"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Decoración floral derecha */}
      <div className="fixed right-0 top-1/4 w-32 h-96 pointer-events-none z-0 opacity-15">
        <img
          src="https://readdy.ai/api/search-image?query=delicate%20botanical%20floral%20branch%20illustration%20with%20small%20flowers%20and%20leaves%2C%20vertical%20arrangement%2C%20soft%20beige%20and%20brown%20tones%2C%20minimalist%20elegant%20design%2C%20watercolor%20style%2C%20feminine%20aesthetic%2C%20simple%20line%20art%2C%20decorative%20element%2C%20transparent%20background%20style&width=200&height=600&seq=floral-right-decoration&orientation=portrait"
          alt="Decoración floral derecha"
          className="w-full h-full object-contain transform scale-x-[-1]"
        />
      </div>
    </>
  );
}
