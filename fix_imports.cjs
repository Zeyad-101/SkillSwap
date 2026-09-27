const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const files = [];
function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
        else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) files.push(fullPath);
    });
}
walk(srcDir);

// File locations relative to src
const fileMap = {
    'main': './main.jsx',
    'main.jsx': './main.jsx',
    'App': './App.jsx',
    'App.jsx': './App.jsx',
    'router': './router.jsx',
    'router.jsx': './router.jsx',
    'AuthContext': './context/AuthContext.jsx',
    'AuthContext.jsx': './context/AuthContext.jsx',
    'supabaseClient': './lib/supabaseClient.js',
    'supabaseClient.js': './lib/supabaseClient.js',
    'profiles': './api/profiles.js',
    'skills': './api/skills.js',
    'matches': './api/matches.js',
    'messages': './api/messages.js',
    'Button': './components/Button.jsx',
    'NavBar': './components/NavBar.jsx',
    'ProtectedRoute': './components/ProtectedRoute.jsx',
    'SkillTag': './components/SkillTag.jsx',
    'MatchCard': './components/MatchCard.jsx',
    'MessageBubble': './components/MessageBubble.jsx',
    'Homepage': './pages/Homepage.jsx',
    'Browse': './pages/Browse.jsx',
    'Dashboard': './pages/Dashboard.jsx',
    'Profile': './pages/Profile.jsx',
    'Chat': './pages/Chat.jsx',
    'Login': './pages/Login.jsx',
    'HowItWorks': './pages/HowItWorks.jsx',
    'index.css': './styles/index.css'
};

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix imports for components, apis, etc.
    content = content.replace(/from\s+['"]\.\/([^'"]+)['"]/g, (match, importPath) => {
        const baseName = importPath.replace(/\.(js|jsx|css)$/, '');
        
        if (fileMap[baseName] || fileMap[importPath]) {
            const targetSrcPath = fileMap[importPath] || fileMap[baseName];
            const currentDir = path.dirname(filePath);
            const targetAbsPath = path.join(srcDir, targetSrcPath);
            let rel = path.relative(currentDir, targetAbsPath).replace(/\\/g, '/');
            if (!rel.startsWith('.')) rel = './' + rel;
            // strip extension if original didn't have it
            if (!importPath.endsWith('.js') && !importPath.endsWith('.jsx') && !importPath.endsWith('.css')) {
                rel = rel.replace(/\.(js|jsx|css)$/, '');
            }
            return `from '${rel}'`;
        }
        return match;
    });

    // Handle import './index.css'
    content = content.replace(/import\s+['"]\.\/([^'"]+)['"]/g, (match, importPath) => {
        if (importPath === 'index.css' || importPath === 'index') {
            const targetSrcPath = './styles/index.css';
            const currentDir = path.dirname(filePath);
            const targetAbsPath = path.join(srcDir, targetSrcPath);
            let rel = path.relative(currentDir, targetAbsPath).replace(/\\/g, '/');
            if (!rel.startsWith('.')) rel = './' + rel;
            return `import '${rel}'`;
        }
        return match;
    });

    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
});
