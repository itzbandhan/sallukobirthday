import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    try {
        const { slug } = req.query;

        // Resolve path to built index.html
        // Vercel usually places static files in process.cwd() or similar, 
        // but with includeFiles it should be accessible.
        const filePath = path.join(process.cwd(), 'dist', 'index.html');
        let html = fs.readFileSync(filePath, 'utf8');

        // Skip if system route or no slug
        if (slug && !slug.includes('.')) {
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);

                // Fetch recipient
                const { data } = await supabase
                    .from('recipients')
                    .select('name_single, name_partner1, name_partner2, invite_type')
                    .eq('slug', slug)
                    .single();

                if (data) {
                    let titleName = "You";
                    if (data.invite_type === 'couple') {
                        titleName = `${data.name_partner1} & ${data.name_partner2}`;
                    } else if (data.name_single) {
                        titleName = data.name_single;
                    } else if (data.invite_type === 'special') {
                        // Fallback or specific logic
                        titleName = "Special Guest";
                    }

                    const pageTitle = `${titleName} | You're Invited`;

                    // Replace standard title
                    html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);

                    // Replace or Inject Open Graph Title
                    const ogTag = `<meta property="og:title" content="${pageTitle}" />`;
                    if (html.includes('<meta property="og:title"')) {
                        html = html.replace(/<meta property="og:title" content=".*?" \/>/, ogTag);
                    } else {
                        html = html.replace('</head>', `${ogTag}\n</head>`);
                    }

                    // Inject Open Graph Image
                    // Use VERCEL_URL if available for absolute path
                    const domain = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
                    const imageUrl = `${domain}/ogimg.png`;
                    const ogImageTag = `<meta property="og:image" content="${imageUrl}" />`;

                    if (html.includes('<meta property="og:image"')) {
                        html = html.replace(/<meta property="og:image" content=".*?" \/>/, ogImageTag);
                    } else {
                        html = html.replace('</head>', `${ogImageTag}\n</head>`);
                    }
                }
            }
        }

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading invitation');
    }
}
