<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Store;

class GenerateSitemap extends Command
{
    protected $signature = "sitemap:generate";
    protected $description = "Generate sitemap.xml with all public store pages";

    public function handle()
    {
        $baseUrl = config("app.url", "https://ns.urdun-tech.com");
        
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
        
        // Static pages
        $staticPages = [
            ["loc" => "/", "priority" => "1.0", "changefreq" => "weekly"],
            ["loc" => "/login", "priority" => "0.8", "changefreq" => "monthly"],
            ["loc" => "/register", "priority" => "0.8", "changefreq" => "monthly"],
            ["loc" => "/pricing", "priority" => "0.9", "changefreq" => "weekly"],
            ["loc" => "/terms", "priority" => "0.3", "changefreq" => "yearly"],
        ];
        
        foreach ($staticPages as $page) {
            $xml .= "    <url>\n";
            $xml .= "        <loc>{$baseUrl}{$page["loc"]}</loc>\n";
            $xml .= "        <lastmod>" . date("Y-m-d") . "</lastmod>\n";
            $xml .= "        <changefreq>{$page["changefreq"]}</changefreq>\n";
            $xml .= "        <priority>{$page["priority"]}</priority>\n";
            $xml .= "    </url>\n";
        }
        
        // Dynamic store pages
        try {
            $stores = Store::where("is_active", true)->get();
            foreach ($stores as $store) {
                if ($store->custom_domain) {
                    $xml .= "    <url>\n";
                    $xml .= "        <loc>https://{$store->custom_domain}</loc>\n";
                    $xml .= "        <lastmod>" . $store->updated_at->format("Y-m-d") . "</lastmod>\n";
                    $xml .= "        <changefreq>daily</changefreq>\n";
                    $xml .= "        <priority>0.7</priority>\n";
                    $xml .= "    </url>\n";
                }
            }
        } catch (\Exception $e) {
            $this->warn("Could not fetch stores: " . $e->getMessage());
        }
        
        $xml .= "</urlset>\n";
        
        file_put_contents(public_path("sitemap.xml"), $xml);
        $this->info("Sitemap generated successfully!");
    }
}
