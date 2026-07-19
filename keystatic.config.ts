import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? { kind: 'github', repo: { owner: 'bonagus', name: 'digital-garden' } }
      : { kind: 'local' },
  ui: {
    brand: { name: 'Bonagus CMS' },
    navigation: {
      Pages: ['home', 'about', 'timelinePage', 'social'],
      Garden: ['notes', 'essays', 'books', 'podcasts', 'projects', 'experiments', 'timeline'],
    },
  },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/settings/home',
      format: { data: 'json' },
      schema: {
        titleActive: fields.text({
          label: 'Judul (teks aktif / berwarna)',
          description: 'Bagian judul yang tampil berwarna aksen, mis. "Bonagus"',
          defaultValue: 'Bonagus',
        }),
        titleRest: fields.text({
          label: 'Judul (teks normal)',
          description: 'Lanjutan judul dengan warna teks biasa',
          multiline: true,
          defaultValue: 'tempat ide tumbuh, catatan berkembang, dan pengetahuan terhubung.',
        }),
        description: fields.text({
          label: 'Deskripsi',
          multiline: true,
          defaultValue:
            'Developer & lifelong learner. Ini adalah digital garden saya — kumpulan catatan, esai, dan eksperimen yang terus berkembang.',
        }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/settings/about',
      format: { data: 'json' },
      schema: {
        titleActive: fields.text({
          label: 'Judul (teks aktif / berwarna)',
          defaultValue: 'Bonagus',
        }),
        titleRest: fields.text({
          label: 'Judul (teks normal)',
          multiline: true,
          defaultValue: '— developer, penulis, dan tukang kebun digital.',
        }),
        description: fields.text({
          label: 'Deskripsi / Bio',
          multiline: true,
          defaultValue:
            'Halo! Saya Bonagus. Ini adalah personal digital garden saya — tempat ide tumbuh, catatan berkembang, dan pengetahuan saling terhubung secara organik.',
        }),
        photo: fields.image({
          label: 'Foto Profil',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        experiences: fields.array(
          fields.object({
            role: fields.text({ label: 'Posisi / Peran' }),
            company: fields.text({ label: 'Perusahaan / Organisasi' }),
            url: fields.url({ label: 'URL (opsional)' }),
            period: fields.text({ label: 'Periode', description: 'mis. "2022 — sekarang"' }),
            summary: fields.text({ label: 'Ringkasan', multiline: true }),
          }),
          {
            label: 'Pengalaman Kerja',
            itemLabel: (props) =>
              `${props.fields.role.value || 'Posisi'} @ ${props.fields.company.value || 'Perusahaan'}`,
          }
        ),
      },
    }),
    timelinePage: singleton({
      label: 'Timeline (Judul & Deskripsi)',
      path: 'src/content/settings/timeline-page',
      format: { data: 'json' },
      schema: {
        title: fields.text({
          label: 'Judul Halaman',
          defaultValue: 'Timeline',
        }),
        description: fields.text({
          label: 'Deskripsi Halaman',
          multiline: true,
          defaultValue:
            'Apa yang sedang saya kerjakan, pelajari, dan pikirkan akhir-akhir ini. Terinspirasi dari konsep /now — sebuah catatan hidup yang diperbarui seiring waktu.',
        }),
      },
    }),
    social: singleton({
      label: 'Kontak & Sosial Media',
      path: 'src/content/settings/social',
      format: { data: 'json' },
      schema: {
        email: fields.text({ label: 'Email', defaultValue: 'hello@bonagus.my.id' }),
        github: fields.url({ label: 'GitHub URL' }),
        twitter: fields.url({ label: 'X / Twitter URL' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        instagram: fields.url({ label: 'Instagram URL' }),
        youtube: fields.url({ label: 'YouTube URL' }),
        website: fields.url({ label: 'Website lain' }),
      },
    }),
  },
  collections: {
    notes: {
      label: 'Notes',
      slugField: 'title',
      path: 'src/content/notes/*',
      format: { contentField: 'body' },
      columns: ['title', 'topics', 'growthStage'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/notes', publicPath: '/images/notes/' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    essays: {
      label: 'Essays',
      slugField: 'title',
      path: 'src/content/essays/*',
      format: { contentField: 'body' },
      columns: ['title', 'featured', 'growthStage'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/essays', publicPath: '/images/essays/' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    books: {
      label: 'Books',
      slugField: 'title',
      path: 'src/content/books/*',
      format: { contentField: 'body' },
      columns: ['title', 'author', 'status'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        author: fields.text({ label: 'Author' }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/books', publicPath: '/images/books/' }),
        rating: fields.number({ label: 'Rating (1-5)' }),
        isbn: fields.text({ label: 'ISBN' }),
        publisher: fields.text({ label: 'Publisher' }),
        year: fields.number({ label: 'Year' }),
        pages: fields.number({ label: 'Pages' }),
        status: fields.select({
          label: 'Status',
          options: [
            { value: 'reading', label: '📖 Reading' },
            { value: 'finished', label: '✅ Finished' },
            { value: 'abandoned', label: '⏹ Abandoned' },
          ],
          defaultValue: 'finished',
        }),
        sourceUrl: fields.url({ label: 'Source URL' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    podcasts: {
      label: 'Podcasts & Audiobooks',
      slugField: 'title',
      path: 'src/content/podcasts/*',
      format: { contentField: 'body' },
      columns: ['title', 'author', 'series'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        author: fields.text({ label: 'Author / Creator' }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/podcasts', publicPath: '/images/podcasts/' }),
        duration: fields.text({ label: 'Duration (e.g. 45 min)' }),
        audioUrl: fields.text({ label: 'Audio URL / Path (mis. /audio/... atau https://...)' }),
        sourceUrl: fields.url({ label: 'Source / Original Post URL' }),
        episode: fields.text({ label: 'Episode' }),
        series: fields.text({ label: 'Series' }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    projects: {
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'body' },
      columns: ['title', 'status', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'archived', label: 'Archived' },
            { value: 'paused', label: 'Paused' },
          ],
          defaultValue: 'active',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        techStack: fields.array(fields.text({ label: 'Tech' }), {
          label: 'Tech Stack',
          itemLabel: (props) => props.value,
        }),
        repoUrl: fields.url({ label: 'Repository URL' }),
        demoUrl: fields.url({ label: 'Demo URL' }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/projects', publicPath: '/images/projects/' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    experiments: {
      label: 'Experiments',
      slugField: 'title',
      path: 'src/content/experiments/*',
      format: { contentField: 'body' },
      columns: ['title', 'status'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Start Date' }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'seedling',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { value: 'exploring', label: '🔍 Exploring' },
            { value: 'concluded', label: '✅ Concluded' },
            { value: 'abandoned', label: '⏹ Abandoned' },
          ],
          defaultValue: 'exploring',
        }),
        cover: fields.image({ label: 'Cover Image', directory: 'public/images/experiments', publicPath: '/images/experiments/' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
    timeline: {
      label: 'Timeline',
      slugField: 'title',
      path: 'src/content/timeline/*',
      format: { contentField: 'body' },
      columns: ['title', 'startDate'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        startDate: fields.date({ label: 'Date', description: 'Tanggal update ini terjadi' }),
        updated: fields.date({ label: 'Updated' }),
        category: fields.select({
          label: 'Kategori',
          options: [
            { value: 'now', label: '📍 Now — sedang dikerjakan' },
            { value: 'milestone', label: '🎯 Milestone' },
            { value: 'update', label: '📝 Update' },
            { value: 'life', label: '🌤 Life' },
          ],
          defaultValue: 'update',
        }),
        topics: fields.array(fields.text({ label: 'Topic' }), {
          label: 'Topics',
          itemLabel: (props) => props.value,
        }),
        growthStage: fields.select({
          label: 'Growth Stage',
          options: [
            { value: 'seedling', label: '🌱 Seedling' },
            { value: 'budding', label: '🌿 Budding' },
            { value: 'evergreen', label: '🌳 Evergreen' },
          ],
          defaultValue: 'evergreen',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        aliases: fields.array(fields.text({ label: 'Alias' }), {
          label: 'Aliases',
          itemLabel: (props) => props.value,
        }),
        body: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/inline',
              publicPath: '/images/inline/',
            },
          },
        }),
      },
    },
  },
});
