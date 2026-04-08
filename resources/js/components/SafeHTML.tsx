import DOMPurify from 'dompurify';
import React from 'react';

interface SafeHTMLProps {
    html: string;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

/**
 * SafeHTML - Renders HTML content safely by sanitizing it with DOMPurify.
 * 
 * Use this component instead of dangerouslySetInnerHTML to prevent XSS attacks.
 * 
 * @example
 * <SafeHTML html={product.description} className="prose max-w-none" />
 * <SafeHTML html={content} as="span" />
 */
const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className, as: Tag = 'div' }) => {
    const sanitizedHTML = React.useMemo(() => {
        if (!html) return '';
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
                'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'span', 'div', 'sub', 'sup', 'hr', 'figure', 'figcaption',
                'video', 'source', 'iframe',
            ],
            ALLOWED_ATTR: [
                'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
                'class', 'style', 'id', 'colspan', 'rowspan', 'align', 'valign',
                'type', 'controls', 'autoplay', 'loop', 'muted', 'poster',
                'frameborder', 'allowfullscreen', 'allow',
            ],
            ALLOW_DATA_ATTR: false,
        });
    }, [html]);

    return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default SafeHTML;
