// Illustrazioni in stile incisione seppia, una per genere. Bozze: da rifinire.
const INK = '#4a3a22';
const ILLUSTRAZIONI = {

// Gotico: finestra illuminata in un muro di pietra, con ramo spoglio e luna
'Gotico': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una finestra gotica illuminata nella notte">
  <defs>
    <radialGradient id="luce" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#f3d58b" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#e2b865" stop-opacity="0.25"/>
    </radialGradient>
  </defs>
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- muro -->
    <rect x="52" y="8" width="196" height="150" rx="3"/>
    <g stroke-width="0.6" opacity="0.55">
      <path d="M52 30H248M52 52H248M52 74H248M52 96H248M52 118H248M52 140H248"/>
      <path d="M80 8V30M120 8V30M170 8V30M210 8V30M96 30V52M140 30V52M190 30V52M228 30V52M72 52V74M110 52V74M214 52V74M236 52V74M86 96V118M200 96V118M70 118V140M226 118V140M100 140V158M180 140V158"/>
    </g>
    <!-- alone di luce -->
    <ellipse cx="150" cy="88" rx="62" ry="72" fill="url(#luce)" stroke="none"/>
    <!-- finestra a sesto acuto -->
    <path d="M122 150V78C122 50 138 30 150 20C162 30 178 50 178 78V150Z" fill="#f6dfa0" fill-opacity="0.75" stroke-width="1.6"/>
    <path d="M114 154V76C114 46 134 22 150 10C166 22 186 46 186 76V154Z" stroke-width="1.4"/>
    <!-- trafori -->
    <path d="M150 22V150M122 96H178M122 124H178"/>
    <circle cx="150" cy="62" r="13"/>
    <circle cx="150" cy="62" r="5"/>
    <path d="M137 62H163M150 49V75" stroke-width="0.8"/>
    <!-- davanzale -->
    <path d="M106 150H194V158H106Z" fill="#efe3c6"/>
    <!-- ramo spoglio -->
    <path d="M8 168C26 150 34 128 50 112C60 102 70 98 82 92"/>
    <path d="M30 138C26 126 28 116 36 108M44 122C54 120 64 122 70 128M50 112C46 102 48 92 54 86M62 104C72 106 80 104 86 100"/>
    <path d="M18 154C12 148 8 144 4 142M36 132C42 134 46 138 48 144" stroke-width="0.9"/>
    <!-- luna -->
    <path d="M262 28C252 30 246 40 248 50C250 60 260 66 270 64C262 62 256 54 256 46C256 38 258 32 262 28Z" fill="#efe3c6" stroke-width="1"/>
    <path d="M272 38L274 44M282 52L288 54M268 76L272 80" stroke-width="0.8"/>
    <!-- terra -->
    <path d="M0 160H300" stroke-width="1.4"/>
    <path d="M10 166H290M30 172H270M60 178H240" stroke-width="0.6" opacity="0.6"/>
  </g>
</svg>`,

// Romanzo: libro aperto, penna d'oca e ramoscello
'Romanzo': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un libro aperto con una penna d'oca e un ramo">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- tavolo -->
    <path d="M10 160H290" stroke-width="1.4"/>
    <path d="M24 166H276M54 172H246" stroke-width="0.6" opacity="0.6"/>
    <!-- libro -->
    <path d="M60 148C96 138 128 140 150 150C172 140 204 138 240 148V62C204 52 172 54 150 64C128 54 96 52 60 62Z" fill="#fbf4e2"/>
    <path d="M150 64V150"/>
    <path d="M66 156C100 148 130 150 150 158C170 150 200 148 234 156" stroke-width="0.9"/>
    <path d="M60 148V156M240 148V156" stroke-width="0.9"/>
    <!-- righe di testo -->
    <g stroke-width="0.7" opacity="0.7">
      <path d="M76 80C96 76 116 78 136 84M76 92C96 88 116 90 136 96M76 104C96 100 116 102 136 108M76 116C96 112 116 114 136 120M76 128C96 124 116 126 128 130"/>
      <path d="M164 84C184 78 204 76 224 80M164 96C184 90 204 88 224 92M164 108C184 102 204 100 224 104M164 120C184 114 204 112 224 116"/>
    </g>
    <!-- penna d'oca -->
    <path d="M214 60C230 34 252 18 276 12C270 34 254 52 232 64Z" fill="#efe3c6"/>
    <path d="M214 60C242 38 262 24 276 12" />
    <path d="M222 62C232 58 238 52 244 44M228 66C238 60 246 54 252 46" stroke-width="0.7"/>
    <path d="M214 60L200 78" stroke-width="1.6"/>
    <!-- ramoscello -->
    <path d="M14 150C30 132 42 120 64 108" />
    <path d="M26 138C22 128 24 120 32 114M38 128C48 126 56 128 62 134M44 120C42 112 44 104 50 98M20 146C14 142 10 138 8 132" stroke-width="1"/>
    <path d="M32 114C28 112 26 108 28 104C32 104 34 108 32 114Z M50 98C46 96 44 92 46 88C50 88 52 92 50 98Z M62 134C60 138 56 140 52 140C52 136 56 134 62 134Z" fill="#e6d8b4" stroke-width="0.8"/>
  </g>
</svg>`,
// Poesia: rotolo di pergamena con ramo d'alloro e penna
'Poesia': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un rotolo di pergamena con un ramo d'alloro">
  <g fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M70 36H226C238 36 238 56 226 56H84C72 56 72 36 84 36" fill="#f3e6c4" fill-opacity="0.7"/>
    <path d="M84 56V132C84 150 70 150 66 138C62 126 72 122 84 124" />
    <path d="M226 56V120C226 140 240 144 244 134" />
    <path d="M84 124H226C238 124 238 144 226 144H72" fill="#f3e6c4" fill-opacity="0.7"/>
    <g stroke-width="0.9" opacity="0.8"><path d="M104 74H206M104 86H196M104 98H206M104 110H180"/></g>
    <path d="M40 150C52 120 60 100 70 80" stroke-width="1.2"/>
    <path d="M52 124c-10-2-14-10-12-16 8 0 14 6 12 16zM58 108c-10-2-14-10-12-16 8 0 14 6 12 16zM64 92c-9-2-13-9-11-15 8 0 13 5 11 15zM56 120c8-6 16-6 20-2-4 6-12 8-20 2zM62 104c8-6 16-6 20-2-4 6-12 8-20 2z"/>
    <path d="M258 22C240 40 226 70 214 100L210 112L220 108C236 84 250 52 258 22Z" fill="#a67c3d" fill-opacity="0.35"/>
  </g>
</svg>`,
// Saggio: libro aperto con una corona
'Saggio': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un libro aperto con una corona">
  <g fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 70C130 58 90 56 60 64V140C90 132 130 134 150 146C170 134 210 132 240 140V64C210 56 170 58 150 70Z" fill="#f3e6c4" fill-opacity="0.7"/>
    <path d="M150 70V146"/>
    <g stroke-width="0.9" opacity="0.8"><path d="M76 82C98 78 120 80 136 86M76 96C98 92 120 94 136 100M76 110C98 106 120 108 136 114M164 86C180 80 202 78 224 82M164 100C180 94 202 92 224 96M164 114C180 108 202 106 224 110"/></g>
    <path d="M118 46L124 20L138 34L150 14L162 34L176 20L182 46Z" fill="#a67c3d" fill-opacity="0.35"/>
    <path d="M118 46H182"/>
  </g>
</svg>`

};

function disegnaIllustrazione(genere) {
    const box = document.getElementById('illustrazione');
    if (box) box.innerHTML = ILLUSTRAZIONI[genere] || '';
}
