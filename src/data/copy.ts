export type Locale = "es" | "en";

export const copy = {
  es: {
    hero: {
      eyebrow: "NO LIMITS CONTROL CENTER",
      role: "Profesional de Sistemas y Desarrollo",
      tagline: "Soluciones Cloud, Automatización e Integración",
      taglineSub: "Cloud · DevOps · IA · Ciberseguridad",
      typedPhrases: [
        "Cloud Solutions",
        "Full-Stack Development",
        "Systems Integration",
        "Automation & DevOps",
      ],
      summary:
        "Diseño y construyo soluciones técnicas con foco en desarrollo, integración, automatización y operación en entornos cloud.",
      ctaPrimary: "Contactar",
      ctaSecondary: "Ver casos de trabajo",
      ctaTertiary: "Descargar CV",
      scroll: "Scroll",
      aria: {
        ctaPrimary: "Ir a la sección de contacto",
        ctaSecondary: "Ver casos de trabajo",
        ctaTertiary: "Abrir CV profesional en nueva pestaña",
        chips: "Características profesionales",
      },
      terminal: {
        headerTitle: "antonio@gaspar:~",
        // Static decorative blocks
        focusTitle: "Áreas de enfoque",
        statusTitle: "Estado del sistema",
        domains: {
          cloud: "CLOUD",
          devops: "DEVOPS",
          ai: "IA",
          security: "SEGURIDAD",
        },
        status: {
          status: "activo",
          mode: "mejora_continua",
          stack: "stack",
          credentials: "verificadas",
          motto: "SIN LÍMITES",
        },
        // Chat UI
        chatDivider: "conversación",
        welcomePrompt: "Pregúntame sobre Antonio",
        inputPlaceholder: "Escribe tu pregunta y pulsa Enter...",
        inputAria: "Escribe tu pregunta sobre Antonio",
        sendAria: "Enviar pregunta",
        messagesRemaining: (n: number) => `${n} mensajes restantes`,
        limitReached: "Límite alcanzado",
        thinking: "procesando...",
        error: "No pude procesar tu pregunta. Intenta preguntar sobre la experiencia, certificaciones o proyectos de Antonio.",
      },
    },
    sections: {
      profile: {
        eyebrow: "SYSTEM PROFILE",
        title: "Perfil Profesional",
        description:
          "Quién soy, cómo trabajo y qué me impulsa técnicamente en desarrollo y cloud.",
        signature: "OPERATIONAL SIGNATURE",
        signatureAria: "Principios operacionales",
        about: [
          "Profesional con foco en desarrollo de soluciones, integración de sistemas, automatización y operación cloud.",
          "Trabajo con una mentalidad orientada a producto, calidad técnica y mejora continua, conectando negocio, ingeniería y operación.",
        ],
        signatureItems: [
          "Diseño orientado a soluciones mantenibles y escalables.",
          "Automatización y calidad como parte del flujo, no como pasos aparte.",
          "Integración de sistemas y entrega continua con foco en valor.",
        ],
      },
      focus: {
        eyebrow: "CURRENT FOCUS",
        title: "Enfoque Actual",
        description:
          "Áreas donde hoy concentro mayor valor, aprendizaje y evolución profesional.",
        items: {
          cloud: {
            title: "Cloud Operations",
            description: "Operación, integración y entrega técnica en entornos cloud modernos.",
          },
          development: {
            title: "Development",
            description: "Soluciones web, APIs, frontend, backend e integración de sistemas.",
          },
          automation: {
            title: "Automation",
            description: "Reducción de tareas repetitivas y mejora de flujos operativos.",
          },
          security: {
            title: "Security",
            description: "Análisis de vulnerabilidades, hardening y buenas prácticas de seguridad.",
          },
          ai: {
            title: "Applied AI",
            description: "Uso práctico de IA para documentación, productividad y mejora operativa.",
          },
          integration: {
            title: "Integration",
            description: "Conexión entre sistemas, datos y procesos con foco en continuidad.",
          },
        },
      },
      skills: {
        eyebrow: "CAPABILITY MATRIX",
        title: "Capacidades",
        description:
          "Capacidades aplicadas a sistemas, desarrollo, cloud y operaciones, organizadas por dominio.",
      },
      projects: {
        eyebrow: "WORK CASES",
        title: "Casos de Trabajo",
        description:
          "Proyectos profesionales agrupados por dominio para reflejar contribuciones reales en frontend, backend e integración.",
        note:
          "Casos seleccionados de trabajo profesional en entornos privados. El foco está en el aporte, la responsabilidad técnica y la amplitud fullstack.",
        featured: "Featured",
        featuredCase: "Featured case",
        cases: "casos",
        featuresAria: "Características del proyecto",
        contributionsAria: "Áreas de contribución",
        impactsAria: "Impactos clave",
        stackAria: "Stack tecnológico",
      },
      experience: {
        eyebrow: "OPERATIONAL TIMELINE",
        title: "Trayectoria Profesional",
        description:
          "Evolución técnica enfocada en desarrollo web, integración de sistemas, cloud y DevOps.",
        aria: "Trayectoria profesional",
        impact: "Impactos clave",
        stack: "Tecnologías utilizadas",
        current: "Actual",
      },
      credentials: {
        eyebrow: "CREDENTIAL VAULT",
        title: "Certificaciones",
        description:
          "Certificaciones, cursos y formación académica agrupados en bloques diferenciados.",
        blocks: {
          certifications: "Certificaciones",
          courses: "Cursos",
          education: "Formación académica",
        },
        filters: {
          all: "Todas",
          cloud: "Cloud",
          security: "Seguridad",
          data: "Datos",
          ai: "IA",
          devops: "DevOps",
          agile: "Agile",
          work: "Trabajo remoto",
          training: "Formación",
          development: "Desarrollo",
          microsoft: "Microsoft",
        },
      },
      cv: {
        eyebrow: "PROFESSIONAL CV",
        title: "CV Profesional",
        description:
          "Descarga la versión que corresponda según el idioma seleccionado.",
      },
      contact: {
        eyebrow: "CONTACT GATEWAY",
        title: "Contacto",
        description:
          "Disponible para oportunidades relacionadas con Cloud, DevOps, Integración de Sistemas, Desarrollo Full-Stack, Automatización, IA y Seguridad.",
        form: "SEND MESSAGE",
        name: "Nombre",
        email: "Email",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "tu@email.com",
        messagePlaceholder: "Cuéntame sobre la oportunidad...",
        button: "Enviar mensaje",
        channels: "PROFESSIONAL CHANNELS",
        aria: {
          form: "Formulario de contacto",
          button: "Enviar mensaje de contacto",
        },
        feedback: {
          fillAll: "Por favor, completa todos los campos.",
          invalidEmail: "Por favor, ingresa un email válido.",
          shortName: "El nombre debe tener al menos 2 caracteres.",
          shortMessage: "El mensaje debe tener al menos 10 caracteres.",
          sending: "Enviando...",
          success: "¡Mensaje enviado con éxito! Te responderé pronto.",
          networkError: "Error de conexión. Verifica tu conexión e intenta de nuevo.",
          genericError: "Error al enviar el mensaje. Intenta de nuevo.",
        },
      },
    },
    footer: {
      tagline: "Systems · Cloud · DevOps · IA · Ciberseguridad",
      credits: "Hecho con Next.js, Tailwind CSS y arquitectura orientada a componentes.",
      copyright: "© {year} Antonio Gaspar",
      linkedin: "LinkedIn de Antonio Gaspar",
      credly: "Credly — credenciales verificadas",
      badgeclaimed: "BadgeClaimed — insignias profesionales",
    },
    ui: {
      openCV: "Abrir CV",
      openCVAria: "Abrir CV en nueva pestaña",
      openCVProfessional: "Abrir CV Profesional",
      closeMenu: "Cerrar menú",
      openMenu: "Abrir menú de navegación",
      navigation: "Navegación principal",
      mobileNavigation: "Menú móvil",
      languageLabel: "Idioma",
    },
  },
  en: {
      hero: {
      eyebrow: "NO LIMITS CONTROL CENTER",
        role: "Systems & Development Professional",
        tagline: "Cloud Solutions, Automation & Integration",
        taglineSub: "Cloud · DevOps · AI · Cybersecurity",
        typedPhrases: [
          "Cloud Solutions",
          "Full-Stack Development",
          "Systems Integration",
          "Automation & DevOps",
        ],
        summary:
          "I design and build technical solutions focused on development, integration, automation, and cloud operations.",
      ctaPrimary: "Contact",
      ctaSecondary: "View work cases",
      ctaTertiary: "Download Resume",
      scroll: "Scroll",
        aria: {
          ctaPrimary: "Go to the contact section",
          ctaSecondary: "View work cases",
          ctaTertiary: "Open professional resume in a new tab",
          chips: "Professional characteristics",
        },
      terminal: {
        headerTitle: "antonio@gaspar:~",
        focusTitle: "Focus areas",
        statusTitle: "System status",
        domains: {
          cloud: "CLOUD",
          devops: "DEVOPS",
          ai: "AI",
          security: "SECURITY",
        },
        status: {
          status: "active",
          mode: "continuous_improvement",
          stack: "stack",
          credentials: "verified",
          motto: "NO LIMITS",
        },
        chatDivider: "conversation",
        welcomePrompt: "Ask me about Antonio",
        inputPlaceholder: "Type your question and press Enter...",
        inputAria: "Type your question about Antonio",
        sendAria: "Send question",
        messagesRemaining: (n: number) => `${n} messages remaining`,
        limitReached: "Limit reached",
        thinking: "processing...",
        error: "I couldn't process your question. Try asking about Antonio's experience, certifications, or projects.",
      },
    },
    sections: {
      profile: {
        eyebrow: "SYSTEM PROFILE",
        title: "Professional Profile",
        description:
          "Who I am, how I work, and what drives my technical approach to development and cloud.",
        signature: "OPERATIONAL SIGNATURE",
        signatureAria: "Operational principles",
        about: [
          "A professional focused on solution development, systems integration, automation, and cloud operations.",
          "I work with a product mindset, a strong focus on technical quality, and a commitment to continuous improvement, connecting business, engineering, and operations.",
        ],
        signatureItems: [
          "Design aimed at maintainable and scalable solutions.",
          "Automation and quality as part of the workflow, not separate steps.",
          "Systems integration and continuous delivery with a focus on value.",
        ],
      },
      focus: {
        eyebrow: "CURRENT FOCUS",
        title: "Current Focus",
        description:
          "Areas where I currently concentrate most of my professional value, learning, and growth.",
        items: {
          cloud: {
            title: "Cloud Operations",
            description: "Operation, integration, and technical delivery in modern cloud environments.",
          },
          development: {
            title: "Development",
            description: "Web solutions, APIs, frontend, backend, and systems integration.",
          },
          automation: {
            title: "Automation",
            description: "Reducing repetitive tasks and improving operational flows.",
          },
          security: {
            title: "Security",
            description: "Vulnerability analysis, hardening, and security best practices.",
          },
          ai: {
            title: "Applied AI",
            description: "Practical use of AI for documentation, productivity, and operational improvement.",
          },
          integration: {
            title: "Integration",
            description: "Connecting systems, data, and processes with continuity in mind.",
          },
        },
      },
      skills: {
        eyebrow: "CAPABILITY MATRIX",
        title: "Technical Capabilities",
        description:
          "Capabilities across systems, development, cloud, and operations, organized by domain.",
      },
      projects: {
        eyebrow: "WORK CASES",
        title: "Work Cases",
        description:
          "Professional projects grouped by domain to reflect real contributions across frontend, backend, and integration.",
        note:
          "Selected professional work cases from private environments. The focus is on contribution, technical ownership, and full-stack breadth.",
        featured: "Featured",
        featuredCase: "Featured case",
        cases: "cases",
        featuresAria: "Project features",
        contributionsAria: "Contribution areas",
        impactsAria: "Key impacts",
        stackAria: "Technology stack",
      },
      experience: {
        eyebrow: "OPERATIONAL TIMELINE",
        title: "Professional Journey",
        description:
          "My technical journey focuses on web development, systems integration, cloud, and DevOps.",
        aria: "Professional journey",
        impact: "Key impacts",
        stack: "Technologies used",
        current: "Current",
      },
      credentials: {
        eyebrow: "CREDENTIAL VAULT",
        title: "Certifications",
        description:
          "Certifications, courses, and academic background organized into separate blocks.",
        blocks: {
          certifications: "Certifications",
          courses: "Courses",
          education: "Academic education",
        },
        filters: {
          all: "All",
          cloud: "Cloud",
          security: "Security",
          data: "Data",
          ai: "AI",
          devops: "DevOps",
          agile: "Agile",
          work: "Remote Work",
          training: "Training",
          development: "Development",
          microsoft: "Microsoft",
        },
      },
      cv: {
        eyebrow: "PROFESSIONAL CV",
        title: "Professional Resume",
        description: "Download the version that matches your selected language.",
      },
      contact: {
        eyebrow: "CONTACT GATEWAY",
        title: "Contact",
        description:
          "Open to opportunities in Cloud, DevOps, Systems Integration, Full-Stack Development, Automation, AI, and Security.",
        form: "SEND MESSAGE",
        name: "Name",
        email: "Email",
        message: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "you@email.com",
        messagePlaceholder: "Tell me about the opportunity...",
        button: "Send message",
        channels: "PROFESSIONAL CHANNELS",
        aria: {
          form: "Contact form",
          button: "Send contact message",
        },
        feedback: {
          fillAll: "Please fill in all fields.",
          invalidEmail: "Please provide a valid email address.",
          shortName: "Name must be at least 2 characters.",
          shortMessage: "Message must be at least 10 characters.",
          sending: "Sending...",
          success: "Message sent successfully! I'll get back to you soon.",
          networkError: "Network error. Please check your connection and try again.",
          genericError: "Failed to send message. Please try again.",
        },
      },
    },
    footer: {
      tagline: "Systems · Cloud · DevOps · AI · Cybersecurity",
      credits: "Built with Next.js, Tailwind CSS, and a component-based architecture.",
      copyright: "© {year} Antonio Gaspar",
      linkedin: "Antonio Gaspar on LinkedIn",
      credly: "Credly — verified credentials",
      badgeclaimed: "BadgeClaimed — professional badges",
    },
    ui: {
      openCV: "View CV",
      openCVAria: "Open CV in a new tab",
      openCVProfessional: "View Professional Resume",
      closeMenu: "Close menu",
      openMenu: "Open navigation menu",
      navigation: "Main navigation",
      mobileNavigation: "Mobile menu",
      languageLabel: "Language",
    },
  },
} as const;
