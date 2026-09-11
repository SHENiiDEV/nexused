import React, { useState } from 'react';
import { Course } from '../types';
import { Sparkles, Terminal, Cpu, Database, Cloud, Globe, Palette, Briefcase, TrendingUp, DollarSign } from 'lucide-react';

interface CourseCoverProps {
    course?: Partial<Course> | null;
    title?: string;
    topic?: string;
    category?: string;
    slug?: string;
    thumbnailUrl?: string | null;
    level?: string;
    aspectRatio?: 'video' | 'wide' | 'square';
    badge?: string;
    className?: string;
}

export function CourseCover({
    course,
    title,
    topic,
    category,
    thumbnailUrl,
    aspectRatio = 'video',
    badge,
    className = '',
}: CourseCoverProps) {
    const [imgError, setImgError] = useState(false);

    const aspectClass = {
        video: 'aspect-video',
        wide: 'aspect-[21/9]',
        square: 'aspect-square',
    }[aspectRatio];

    const courseTitle = course?.title || title || 'Engineering Course';
    const courseTopic = course?.topic || course?.category || topic || category || 'Software Architecture';
    const courseThumbnail = course?.thumbnail_url || thumbnailUrl || null;
    const courseHours = course?.estimated_hours || (course as any)?.duration_hours || 6;

    const getTopicTheme = () => {
        const text = ((courseTopic || '') + ' ' + (courseTitle || '')).toLowerCase();

        if (text.includes('english') || text.includes('language') || text.includes('communication') || text.includes('ielts') || text.includes('speaking')) {
            return {
                icon: Globe,
                tag: 'EXECUTIVE ENGLISH & FLUENCY',
                accent: 'text-sky-400',
                badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
                border: 'border-sky-500/30',
            };
        }
        if (text.includes('design') || text.includes('figma') || text.includes('ui') || text.includes('ux')) {
            return {
                icon: Palette,
                tag: 'UI/UX & DESIGN SYSTEMS',
                accent: 'text-pink-400',
                badgeBg: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
                border: 'border-pink-500/30',
            };
        }
        if (text.includes('agile') || text.includes('scrum') || text.includes('management') || text.includes('project')) {
            return {
                icon: Briefcase,
                tag: 'AGILE LEADERSHIP & SCRUM',
                accent: 'text-indigo-400',
                badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
                border: 'border-indigo-500/30',
            };
        }
        if (text.includes('marketing') || text.includes('growth') || text.includes('seo') || text.includes('ads')) {
            return {
                icon: TrendingUp,
                tag: 'GROWTH HACKING & MARKETING',
                accent: 'text-orange-400',
                badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
                border: 'border-orange-500/30',
            };
        }
        if (text.includes('finance') || text.includes('valuation') || text.includes('accounting') || text.includes('invest')) {
            return {
                icon: DollarSign,
                tag: 'CORPORATE FINANCE & MODELING',
                accent: 'text-emerald-400',
                badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                border: 'border-emerald-500/30',
            };
        }
        if (text.includes('go') || text.includes('golang')) {
            return {
                icon: Terminal,
                tag: 'GO ARCHITECTURE',
                accent: 'text-sky-400',
                badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
                border: 'border-sky-500/30',
            };
        }
        if (text.includes('kube') || text.includes('k8s') || text.includes('cloud') || text.includes('devops')) {
            return {
                icon: Cloud,
                tag: 'K8S & CLOUD',
                accent: 'text-blue-400',
                badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
                border: 'border-blue-500/30',
            };
        }
        if (text.includes('ai') || text.includes('agent') || text.includes('llm')) {
            return {
                icon: Cpu,
                tag: 'AI ARCHITECTURE',
                accent: 'text-emerald-400',
                badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                border: 'border-emerald-500/30',
            };
        }
        return {
            icon: Database,
            tag: 'DISTRIBUTED SYSTEMS',
            accent: 'text-amber-400',
            badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
            border: 'border-amber-500/30',
        };
    };

    const theme = getTopicTheme();
    const Icon = theme.icon;

    return (
        <div
            className={`relative ${aspectClass} bg-slate-950 overflow-hidden select-none group ${className}`}
        >
            {courseThumbnail && !imgError ? (
                <img
                    src={courseThumbnail}
                    alt={courseTitle}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    loading="lazy"
                />
            ) : (
                /* Fallback vector rendering */
                <div className="w-full h-full flex flex-col justify-between p-6 bg-radial from-slate-900 to-slate-950 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${theme.badgeBg}`}
                        >
                            <Icon className={`w-3 h-3 ${theme.accent}`} />
                            <span>{theme.tag}</span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                    </div>

                    <div className="space-y-1 my-auto">
                        <h4 className="text-sm sm:text-base font-extrabold text-white line-clamp-2 tracking-tight">
                            {courseTitle}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                            {courseTopic}
                        </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{courseHours}h Curriculum</span>
                        <span className="text-emerald-500 font-semibold">Verified Architecture</span>
                    </div>
                </div>
            )}

            {/* Top Corner Ribbon / Badge */}
            {badge && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 font-sans shadow-md tracking-tight">
                        {badge}
                    </span>
                </div>
            )}
        </div>
    );
}
