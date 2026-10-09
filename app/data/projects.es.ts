import type { ProjectTranslation } from './projects'

// Spanish text for each project, keyed by project id. Missing fields fall
// back to the English in projects.ts.
export const projectsEs: Record<string, ProjectTranslation> = {
  'codecave': {
    title: 'codeCave — Sitio del estudio',
    description: 'El sitio de codeCave, un estudio de producto de Córdoba. Una identidad con estética de terminal, neón sobre fondo oscuro, construida de punta a punta en Nuxt — "de la idea a producción".',
    caseStudy: {
      tagline: 'Diseñé y construí el sitio del propio estudio: una identidad con personalidad que demuestra el trabajo.',
      role: 'Diseño + Frontend',
      problem: 'El sitio de un estudio tiene que hacer más que listar servicios: tiene que ser la prueba. codeCave necesitaba una home que dijera de entrada "construimos producto con personalidad y listo para producción", no otro template genérico de agencia con ilustraciones de stock y un formulario de contacto.',
      approach: 'Le di al sitio una identidad inspirada en la terminal: paleta de neón sobre oscuro, indicadores de estado en monoespaciada y un hero de línea de comandos ("$ cave new") que anima "DE LA IDEA A PRODUCCIÓN". Todo es bilingüe (ES/EN), está hecho con Nuxt 4 + Tailwind y tiene un sistema de casos de estudio reutilizable para publicar trabajos de clientes con una estructura consistente.',
      result: 'Está online en codecave.ar. La identidad se lee como un producto, no como un folleto, y el sistema de casos de estudio le permite al equipo publicar trabajos nuevos rápido sin perder una voz consistente.',
      highlights: [
        'Hero inspirado en la terminal, con salida de línea de comandos animada',
        'Bilingüe ES/EN con i18n completo',
        'Layout de casos de estudio reutilizable para trabajos de clientes',
        'Construido de punta a punta con Nuxt 4 + Tailwind'
      ],
      metricLabels: ['Construyendo desde', 'Proyectos lanzados', 'Personas en el equipo']
    }
  },
  'enter': {
    title: 'Enter — Venta de entradas online',
    description: 'Una plataforma de entradas hecha en Argentina: QR firmados, un escáner web que funciona en cualquier celular y una comisión fija del 2% con Mercado Pago. Una identidad retro de talón de entrada, audaz, que se despega de la ticketera corporativa.',
    caseStudy: {
      tagline: 'Entradas sin fricción: vendé en minutos, con 2% de comisión y costo cero para eventos gratuitos.',
      role: 'Diseño de producto + Frontend',
      problem: 'Vender entradas en Argentina es elegir entre plataformas grandes con comisiones altas y contratos rígidos, o improvisar con transferencias y listas en WhatsApp. Quienes organizan fiestas, festivales y eventos comunitarios necesitaban algo simple, barato y confiable, sin hardware, sin papeleo y sin costos por adelantado.',
      approach: 'Diseñé Enter alrededor de una identidad retro de talón de entrada: bordes troquelados, tipografía tipo sello y una paleta cálida de papel que se siente como una entrada física, no como un checkout corporativo. Debajo de esa piel hay un producto serio: QR firmados únicos por entrada, un escáner web que corre en la cámara de cualquier celular, ubicaciones numeradas, códigos de descuento, roles de equipo y reembolsos en un clic. Los pagos van por Mercado Pago con cuotas, y los eventos gratuitos no pagan nada.',
      result: 'Está online en enter.ar. Quien organiza pasa del registro a vender en unos cinco minutos, y la identidad "hecho en Argentina" le da al producto una personalidad que las plataformas establecidas no tienen.',
      highlights: [
        'QR firmados, únicos por entrada, para frenar las falsificaciones',
        'Escáner web: cualquier smartphone, sin hardware',
        'Comisión fija del 2% con Mercado Pago; los eventos gratuitos pagan ARS 0',
        'Ubicaciones numeradas, códigos de descuento, roles de equipo y reembolsos',
        'Identidad visual retro de talón de entrada, pensada primero en español'
      ],
      metricLabels: ['Comisión por venta paga', 'Para eventos gratuitos', 'Para empezar a vender']
    }
  },
  'docta': {
    title: 'Docta — Agenda cultural de Córdoba',
    description: 'Una agenda cultural de Córdoba curada a mano: recitales, teatro, festivales y noche, actualizada todos los días. Un diseño editorial, inspirado en lo impreso, que hace que buscar qué hacer se sienta como leer una revista.',
    caseStudy: {
      tagline: 'Una agenda cultural de Córdoba curada a mano, diseñada para que se sienta como leer una revista.',
      role: 'Diseño + Frontend',
      problem: 'Enterarse de qué hay en Córdoba implica scrollear cuentas de Instagram dispersas y depender del boca en boca. No había un solo lugar bien diseñado para descubrir recitales, teatro, festivales y noche, y la cultura merece una presentación mejor que una planilla de eventos.',
      approach: 'Fui a fondo con una estética editorial, inspirada en lo impreso: tipografía serif de display, una paleta cálida de papel y una portada que trata las elecciones de la semana como la tapa de una revista ("La docta arde esta semana"). Los eventos se curan a mano todos los días y se pueden explorar en vista de eventos, mapa y calendario, pensados primero en español e inconfundiblemente locales.',
      result: 'Está online en docta.ar. El diseño se destaca entre tantos sitios de eventos genéricos y hace que buscar qué hacer sea una experiencia en sí misma.',
      highlights: [
        'Lenguaje visual editorial, inspirado en el diario',
        'Eventos curados a mano, actualizados todos los días',
        'Vistas de eventos, mapa y calendario',
        'Pensado primero en español, enfocado en Córdoba'
      ]
    }
  },
  'ef1': {
    title: 'eF1 — Eficiencia Constructiva',
    description: 'El sitio de una constructora de Córdoba especializada en BIM y Lean Construction. Un hero editorial con aplomo sobre fotos reales de obra, pensado para transmitir orden, claridad y resultados.',
    caseStudy: {
      tagline: 'Una constructora que innova merece un sitio que lo muestre, no un template con fotos de stock.',
      role: 'Diseño + Frontend',
      problem: 'eF1 gestiona obras con modelado BIM y metodologías Lean, una forma genuinamente moderna de construir. Pero la mayoría de los sitios de constructoras son intercambiables: cascos de stock, azul genérico y una lista de servicios. eF1 necesitaba una presencia web a la altura de cómo trabaja de verdad: precisa, tecnológica y confiable para inversores que valoran el orden y los resultados.',
      approach: 'Armé la identidad con su propio material: fotos de obra a sangre con un titular editorial contundente ("Eficiencia constructiva." mezclando sans y caligráfica) y un acento amarillo medido. El sitio recorre sus seis servicios, desde Obra Digital (modelos BIM 3D que resuelven interferencias antes de que cuesten plata en obra) hasta el acompañamiento post entrega, con un portfolio de obras recientes que abarca proyectos residenciales, comerciales y de salud.',
      result: 'Se lanzó como la presencia web de la empresa. El sitio explica BIM y Lean Construction en lenguaje simple y le da a eF1 una identidad visual que la separa de la competencia hecha con templates.',
      highlights: [
        'Hero editorial sobre fotos reales de obra',
        'Arquitectura de servicios clara: BIM, control de costos, dirección técnica',
        'Portfolio de obras recientes en distintos sectores',
        'Paleta medida con un único acento amarillo'
      ]
    }
  },
  'habito': {
    title: 'Habito — Gestión de tareas con IA',
    description: 'Gestión de tareas para la era de la IA, donde personas y agentes de IA comparten un mismo espacio de trabajo y se coordinan como compañeros de equipo de verdad. Diseño de producto y frontend para una interfaz SaaS limpia y enfocada.',
    caseStudy: {
      tagline: 'Un gestor de tareas pensado para equipos donde personas y agentes de IA trabajan codo a codo.',
      role: 'Diseño de producto + Frontend',
      problem: 'La mayoría de las herramientas de tareas tratan a la IA como un chat agregado a último momento. Pero los equipos cada vez delegan más trabajo real en agentes, y no existe un espacio compartido donde personas y agentes (incluso agentes de distintas organizaciones) se coordinen como compañeros de equipo reales, con estado, responsables y rendición de cuentas.',
      approach: 'Diseñé un espacio de trabajo donde cualquier tarea puede estar a cargo de una persona o de un agente. La interfaz lo mantiene legible: estados de tarea claros, etiquetas de agente y sincronización en tiempo real para que siempre sepas quién (o qué) está haciendo qué. El producto se mantiene tranquilo y enfocado en un tema oscuro, con un sitio de marketing que explica el modelo "personas + agentes" sin jerga.',
      result: 'Está online en habito.ar, con sitio de marketing y app de producto. El posicionamiento "new era AI" ofrece una mirada clara y con opinión sobre cómo trabajan de verdad los equipos asistidos por agentes.',
      highlights: [
        'Espacio de trabajo compartido entre personas y agentes de IA',
        'Coordinación de agentes entre organizaciones',
        'Estado y responsable de cada tarea en tiempo real',
        'UI de producto en tema oscuro, tranquila y enfocada'
      ]
    }
  },
  'asistente': {
    title: 'Asistente — Tu agenda trabaja sola',
    description: 'Un SaaS de turnos para profesionales independientes en Argentina: una página de reservas para compartir, cobro de señas y recordatorios automáticos, para que la agenda se maneje sola.',
    caseStudy: {
      tagline: 'Una página de reservas que cobra la seña y manda recordatorios sola, para que los profesionales independientes dejen de perseguir a quienes faltan.',
      role: 'Diseño de producto + Frontend',
      problem: 'Los profesionales independientes en Argentina (instructores, terapeutas, peluqueros, consultores) pierden horas en idas y vueltas por mensaje y plata por los turnos a los que nadie viene. Las opciones disponibles son SaaS internacionales pesados que ignoran cómo se paga acá, o una mezcla frágil de WhatsApp, una planilla y recordatorios a mano.',
      approach: 'Diseñé y construí un producto de reservas enfocado en una sola promesa: "tu agenda trabaja sola". El cliente abre una página para compartir, elige un horario y paga una seña por adelantado; después el sistema manda recordatorios automáticos para que los turnos se cumplan. La experiencia está pensada primero en español, específica para Argentina y con la menor fricción posible: no hace falta tarjeta de crédito para empezar.',
      result: 'Está online en asistente.ar. El producto convierte un flujo disperso entre WhatsApp y planillas en una sola página que reserva, cobra y recuerda, sin perseguir a nadie a mano.',
      highlights: [
        'Página de reservas para compartir, una por profesional',
        'Cobro de seña por adelantado para reducir las ausencias',
        'Recordatorios automáticos de turnos',
        'Pensado primero en español, hecho para el mercado argentino'
      ]
    }
  },
  'yoga-wellness-app': {
    title: 'App de yoga y bienestar',
    description: 'Una experiencia mobile consciente, diseñada para guiar a las personas en prácticas de yoga, sesiones de meditación y seguimiento de bienestar, con una interfaz intuitiva y serena.',
    caseStudy: {
      tagline: 'Una experiencia mobile serena y guiada para yoga, meditación y seguimiento de bienestar.',
      role: 'Diseño de producto',
      problem: 'Las apps de bienestar muchas veces se sienten tan ruidosas y exigentes como el estrés que prometen aliviar: dashboards recargados, rachas agresivas y colores estridentes. Una experiencia de yoga y meditación tiene que sentirse como la práctica misma: tranquila, enfocada y sin apuro.',
      approach: 'Diseñé una experiencia mobile alrededor de un lenguaje visual suave y aireado: espaciado generoso, degradados sutiles y tipografía calma. Los flujos guían por sesiones de yoga, meditación y un seguimiento de bienestar simple sin abrumar, y cada pantalla se enfoca en un único próximo paso claro.',
      result: 'Lo entregué como un diseño de producto mobile completo en Figma: un sistema coherente de pantallas, componentes y flujos listo para desarrollo.',
      highlights: [
        'Flujos guiados de sesiones de yoga y meditación',
        'Seguimiento liviano de bienestar y progreso',
        'Lenguaje visual sereno y aireado',
        'Interacción y prototipado mobile-first'
      ]
    }
  },
  'brand-spark': {
    title: 'Brand Spark — Identidad de marca en vivo',
    labTag: 'LLM · UI en streaming',
    description: 'Describí una marca en dos o tres oraciones y mirá cómo se genera en vivo una identidad completa (nombre, paleta, combinaciones tipográficas, voz y moodboard) mientras la propia página cambia de estilo a medida que llega el streaming.',
    caseStudy: {
      tagline: 'Un generador de marcas con IA que demuestra su resultado usándolo: la página adopta cada identidad a medida que llega.',
      role: 'Diseño de producto con IA + Frontend',
      problem: 'La mayoría de las herramientas de branding con IA te devuelven un PDF estático o una grilla de logos sin contexto. Ves muestras de color, no una marca: nada muestra cómo la paleta, la tipografía y la voz funcionan juntas en una interfaz real, que es lo único que importa cuando tenés que decidir si una identidad funciona.',
      approach: 'Armé la demo para que el resultado tenga que probarse a sí mismo: mientras el modelo devuelve la marca por streaming, la página se reestiliza en tiempo real con la paleta y las tipografías generadas. Cada identidad llega como datos estructurados: tokens de color con nombre, combinaciones de tipografía principal y de texto con su fundamento, una declaración de voz con listas de qué hacer y qué no, y un moodboard con imágenes generadas para que combinen. Cada sección se puede regenerar por separado sin descartar el resto, y la identidad completa se exporta como JSON para pasar directo a design tokens.',
      result: 'Está online y se puede probar. Funciona también como demo de las piezas que necesita una funcionalidad de IA en producción: streaming, salidas estructuradas, imágenes generadas y una UI que responde a lo que devuelve el modelo en lugar de solo imprimirlo.',
      highlights: [
        'Theming en vivo: la página adopta la identidad generada mientras llega el streaming',
        'Salida estructurada: tokens de color, combinaciones tipográficas, voz, textos',
        'Regeneración por sección sin perder el resto',
        'Imágenes de moodboard generadas, más previews de sitio y redes',
        'Exportación a JSON para pasar a design tokens'
      ]
    }
  },
  'loft-3d': {
    title: 'Loft interactivo — Escena 3D',
    labTag: 'Three.js · 3D',
    description: 'Un loft que podés recorrer orbitando en el navegador. Todo lo que se ilumina al hacer hover se puede clickear: los muebles abren paneles, los objetos de la mesa hacen lo suyo y un Shiba da vueltas por ahí.',
    caseStudy: {
      tagline: 'Un cuarto 3D armado a mano donde el hover te enseña qué clickear: sin tutorial, sin capa de instrucciones.',
      role: 'Diseño + Frontend',
      problem: 'El 3D interactivo en la web suele fallar de dos maneras: se ve bien pero no sabés qué podés tocar, o se explica con una capa de instrucciones que nadie lee. Quería ver si una escena podía enseñar sus propias affordances solo con luz.',
      approach: 'Armé un loft con modelos con licencia CC e hice del hover todo el tutorial: cualquier cosa interactiva se ilumina cuando el cursor pasa por encima, así que explorar enseña las reglas. Al clickear un mueble se abre un panel de detalle; cada objeto chico de la mesa tiene su propio comportamiento; un Shiba se mueve por el espacio. La navegación es con órbita y zoom con la rueda, y alejar el zoom te saca de cualquier objeto, así que no hay callejones sin salida. La geometría está comprimida con DRACO para que la escena cargue con una conexión normal.',
      result: 'Funciona en el navegador, sin plugins ni instalación. La escena es un banco de pruebas para patrones de interacción en 3D: cómo señalar qué se puede tocar, cómo dejar que alguien salga de un estado sin botón de volver y cómo hacer que una escena cargada de assets cargue rápido.',
      highlights: [
        'Resaltado en hover como único tutorial',
        'Muebles clickeables con paneles de detalle',
        'Objetos con comportamiento propio y un Shiba que pasea',
        'Navegación con órbita + rueda, con el zoom out como salida universal',
        'Geometría comprimida con DRACO para tiempos de carga razonables'
      ]
    }
  },
  'contap': {
    title: 'Contap — Uñas NFC',
    description: 'Uñas con chip NFC: alguien acerca el celular a tu mano y se abre el link que elegiste. Un producto con tienda, precios y un destino editable para cada chip.',
    caseStudy: {
      tagline: 'Convertir un objeto físico en un link que podés cambiar cuando quieras.',
      role: 'Diseño de producto + Frontend',
      problem: 'Los productos NFC suelen venderse como tarjetas o llaveros y se explican con lenguaje técnico que da por sentado que ya sabés qué es NFC. La versión interesante (llevar el chip puesto, para que compartir un contacto no requiera ningún objeto ni tipear nada) necesitaba una historia de producto que hiciera obvia la idea para alguien que nunca escuchó hablar de la tecnología.',
      approach: 'Construí el sitio del producto alrededor del gesto y no de la tecnología: tipografía enorme con la promesa ("tu contacto en tu mano"), una explicación en lenguaje simple para quien se pregunta qué es un NFC, y una tienda donde el chip y su destino son cosas separadas: comprás la uña una vez y después la podés apuntar a donde quieras. Cada dueña tiene una cuenta para editar su propio link.',
      result: 'Está online con la tienda, la explicación y el flujo de cuentas funcionando.',
      highlights: [
        'Historia de producto guiada por el gesto, no por la tecnología',
        'Explicación en lenguaje simple de "¿qué es un NFC?"',
        'Tienda con línea de productos y precios',
        'Cuenta por usuario para editar el link de destino del chip'
      ]
    }
  },
  'jelly': {
    title: 'Jelly — Estrella de mar blandita en WebGPU',
    labTag: 'WebGPU · soft-body',
    description: 'Una estrella de mar translúcida que vive en tu navegador. Movete para hacerte amiga, agarrá un brazo, estiralo y soltalo: un experimento chico de física soft-body y renderizado WebGPU con Three.js.',
    caseStudy: {
      tagline: 'Una criaturita del océano que podés tocar, estirar y soltar, sin más instrucciones que "dale, hacé olas".',
      role: 'Diseño + Frontend',
      problem: 'La mayoría de las demos de WebGPU son cubos girando y contadores de partículas: técnicamente impresionantes, emocionalmente planas. Quería averiguar si un solo objeto 3D podía sentirse lo bastante vivo como para que la gente juegue con él sin que se lo pidan, y si el nuevo pipeline de renderizado está listo para algo que tiene que sentirse bien, no solo correr rápido.',
      approach: 'Toda la página es una sola criatura. Una estrella de mar rosa y translúcida flota en un océano oscuro y estrellado y responde al cursor: si te acercás, deriva hacia vos; si agarrás un brazo, se estira como gelatina; si lo soltás, se bambolea hasta recuperar la forma. El texto es mínimo a propósito (un eyebrow, dos líneas de titular en sans y serif, y dos pistas abajo) para que la interacción sea la interfaz. Renderiza con WebGPU y Three.js, con un material moteado y con subsurface que vende la sensación de blandito.',
      result: 'Funciona en el navegador. Es un pequeño patio de juegos para las preguntas a las que siempre vuelvo en 3D: cómo hacer que un objeto se sienta físico, cómo invitar a tocar sin un tutorial y qué cambia WebGPU para el trabajo creativo en la web.',
      highlights: [
        'Estiramiento soft-body: agarrá un brazo, tirá y soltá',
        'Con el cursor cerca, la criatura deriva hacia vos',
        'Controles de teclado: las flechas mueven, la barra espaciadora hace rebotar, Escape suelta',
        'Material de gelatina translúcido y moteado, renderizado con WebGPU',
        'Texto editorial mínimo para que la interacción sea la interfaz',
        'Combinación tipográfica sans + serif sobre un fondo oscuro y estrellado'
      ]
    }
  }
}
