module.exports = {
  ci: {
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'is-on-https': 'off',
        'canonical': 'off',
        'uses-http2': 'off',
        'uses-rel-preconnect': 'off',
        'uses-rel-preload': 'off',
        'uses-optimized-images': 'off',
        'unsized-images': 'off',
      }
    },
    collect: {
      startServerCommand: 'yarn run start',
      startServerReadyPattern: 'started server on',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/blog',
        'http://localhost:3000/opensource'
      ],
      settings: {
        skipAudits: [
          'is-on-https',
          'canonical',
          'uses-http2',
          'uses-rel-preconnect',
          'uses-rel-preload'
        ]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
