import{j as r}from"./ui-DsknwUKb.js";import{K as L,h as D,g as K}from"./app-C4s3hl53.js";import P from"./Header-D-Cwstbo.js";import H from"./Footer-CigpsYg3.js";import{u as E}from"./use-favicon-DYFIWHke.js";import"./vendor-CxtKjBZA.js";/* empty css            *//* empty css                  */import"./utils-DBYZG17H.js";import"./globe-D1yU1IGs.js";import"./menu-CPyGhTCH.js";import"./mail-CuM3_e84.js";import"./phone-CX_QGePy.js";import"./map-pin-BuFdKgJO.js";import"./circle-check-big-BjHOj0eT.js";import"./send-CJCaoL4_.js";function Y(){var b,d,u,x,y,v,h,f,j,k,_,w,F;const I=`
    /* Fix form inputs */
    .custom-page-content input:focus, 
    .custom-page-content textarea:focus {
      --tw-ring-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
    }
    
    /* Fix color issues */
    .custom-page-content .bg-blue-50 { background-color: rgba(var(--primary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-purple-50 { background-color: rgba(var(--secondary-color-rgb), 0.1) !important; }
    .custom-page-content .bg-green-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    .custom-page-content .bg-red-50 { background-color: rgba(var(--accent-color-rgb), 0.1) !important; }
    
    .custom-page-content .text-blue-600 { color: var(--primary-color) !important; }
    .custom-page-content .text-purple-600 { color: var(--secondary-color) !important; }
    .custom-page-content .text-green-600 { color: var(--accent-color) !important; }
    .custom-page-content .text-red-600 { color: var(--accent-color) !important; }
    
    .custom-page-content .border-blue-500 { border-color: var(--primary-color) !important; }
    .custom-page-content .border-purple-500 { border-color: var(--secondary-color) !important; }
    .custom-page-content .border-green-500 { border-color: var(--accent-color) !important; }
    .custom-page-content .border-red-500 { border-color: var(--accent-color) !important; }
    
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
    .custom-page-content .bg-purple-600 { background-color: var(--secondary-color) !important; }
    .custom-page-content .bg-green-600 { background-color: var(--accent-color) !important; }
    .custom-page-content .bg-red-500 { background-color: var(--accent-color) !important; }
    
    /* Fix border colors */
    .custom-page-content .border-blue-200 { border-color: rgba(var(--primary-color-rgb), 0.2) !important; }
    .custom-page-content .border-green-200 { border-color: rgba(var(--accent-color-rgb), 0.2) !important; }
    
    /* Fix hover states */
    .custom-page-content .hover:bg-blue-700:hover { background-color: var(--primary-color) !important; opacity: 0.9; }
    
    /* Fix form button */
    .custom-page-content .bg-blue-600 { background-color: var(--primary-color) !important; }
  `,p=L(),{page:c,customPages:C=[],settings:o,superadminLogoDark:N,superadminLogoLight:s}=p.props,{auth:m,superadminSettings:e}=p.props,l=(e==null?void 0:e.metaKeywords)||"",a=e!=null&&e.metaImage?D(e.metaImage):"",n=((d=(b=o==null?void 0:o.config_sections)==null?void 0:b.theme)==null?void 0:d.primary_color)||"#3b82f6",i=((x=(u=o==null?void 0:o.config_sections)==null?void 0:u.theme)==null?void 0:x.secondary_color)||"#8b5cf6",g=((v=(y=o==null?void 0:o.config_sections)==null?void 0:y.theme)==null?void 0:v.accent_color)||"#10b77f";return E(),r.jsxs(r.Fragment,{children:[r.jsxs(K,{children:[r.jsx("title",{children:c.meta_title||c.title}),c.meta_description&&r.jsx("meta",{name:"description",content:c.meta_description}),l&&r.jsx("meta",{name:"keywords",content:l}),a&&r.jsx("meta",{property:"og:image",content:a}),a&&r.jsx("meta",{name:"twitter:image",content:a}),r.jsx("style",{children:I})]}),r.jsxs("div",{className:"min-h-screen bg-white",style:{"--primary-color":n,"--secondary-color":i,"--accent-color":g,"--primary-color-rgb":((h=n.replace("#","").match(/.{2}/g))==null?void 0:h.map(t=>parseInt(t,16)).join(", "))||"59, 130, 246","--secondary-color-rgb":((f=i.replace("#","").match(/.{2}/g))==null?void 0:f.map(t=>parseInt(t,16)).join(", "))||"139, 92, 246","--accent-color-rgb":((j=g.replace("#","").match(/.{2}/g))==null?void 0:j.map(t=>parseInt(t,16)).join(", "))||"16, 185, 129"},children:[r.jsx(P,{settings:o,customPages:C,sectionData:((_=(k=o==null?void 0:o.config_sections)==null?void 0:k.sections)==null?void 0:_.find(t=>t.key==="header"))||{},brandColor:n,superadminLogoDark:N,superadminLogoLight:s,user:m==null?void 0:m.user}),r.jsx("main",{className:"pt-16",children:r.jsx("div",{className:"container mx-auto px-4 py-12",children:r.jsxs("div",{className:"max-w-4xl mx-auto",children:[r.jsx("h1",{className:"text-4xl font-bold mb-8 text-gray-900",children:c.title}),r.jsx("div",{className:"custom-page-content prose prose-lg max-w-none",dangerouslySetInnerHTML:{__html:c.content}})]})})}),r.jsx(H,{settings:o,sectionData:((F=(w=o==null?void 0:o.config_sections)==null?void 0:w.sections)==null?void 0:F.find(t=>t.key==="footer"))||{},brandColor:n,superadminLogoLight:s})]})]})}export{Y as default};
