let transform = [
    [
        "babelify",
        {
            "presets": [
                "es2015"
            ],
            "plugins": [
                "add-module-exports"
            ]
        }
    ]
];
module.exports = {
    build: {
        files: {
            'dist/tooltip.js': ['src/tooltip.js']
        },
        browserifyOptions: {
            standalone: 'Tooltip',
            transform
        },
        minifyFiles: {
            'dist/tooltip-min.js': ['dist/tooltip.js']
        },
        bannerFiles: ['dist/*']
    },
    tests: {
        mocha: {
            files: ['tests/*.js'],
            transform
        }
    }
};
