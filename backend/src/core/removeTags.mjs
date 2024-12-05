export function removeTags(htmlString) { 
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}