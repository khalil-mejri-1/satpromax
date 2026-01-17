require('babel-register')({
    presets: ['es2015', 'react']
});

const Sitemap = require('react-router-sitemap').default;
const router = require('./src/routes').default;

function generateSitemap() {
    return (
        new Sitemap(router)
            .build('https://satpromax.com') // ضع رابط موقعك
            .save('./public/sitemap.xml')
    );
}

generateSitemap();
