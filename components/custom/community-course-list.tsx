"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommunityCourseListProps {
  communityId: string;
}

export function CommunityCourseList({ communityId }: CommunityCourseListProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}/courses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">No courses available yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-zinc-900/50 border-white/10 overflow-hidden hover:border-cyan-500/50 transition">
            {course.thumbnailUrl && (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                {course.description || "No description available"}
              </p>

              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-4">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration} min
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.enrollmentCount} enrolled
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-semibold">
                  {course.price ? `$${course.price}` : "Free"}
                </span>
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                  Enroll
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
