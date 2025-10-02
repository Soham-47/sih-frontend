import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface BlogPost {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
}

const Blog = () => {
  const { t } = useTranslation();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: t("rice_farming.title"),
      preview: t("rice_farming.preview"),
      fullContent: t("rice_farming.fullContent"),
    },
    {
      id: 2,
      title: t("wheat_farming.title"),
      preview: t("wheat_farming.preview"),
      fullContent: t("wheat_farming.fullContent"),
    },
  ];
  return (
    <div className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="text-center mt-8">
        <h2 className="text-4xl font-bold text-[#0A3D62] mb-3">
          {t("farmers_blog.title")}
        </h2>
        <p className="text-lg text-[#374151] max-w-2xl mx-auto">
          {t("farmers_blog.description")}
        </p>
      </div>

      {/* Blog Flex Layout */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-6 justify-center">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col flex-1 min-w-[280px] max-w-sm bg-white"
            >
              <CardHeader className="border-b bg-[#E6F4EA]">
                <CardTitle className="text-xl text-[#14532d] font-semibold">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base text-[#374151] leading-relaxed">
                  {post.preview}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setSelectedBlog(post)}
                  className="w-full bg-[#0A3D62] hover:bg-[#14532d] text-white font-medium"
                >
                  {t("farmers_blog.read_more")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Modal Dialog */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl text-[#0A3D62] font-bold pr-8">
              {selectedBlog?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 prose prose-lg max-w-none">
            <p className="text-[#1F2937] leading-relaxed whitespace-pre-line">
              {selectedBlog?.fullContent}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
