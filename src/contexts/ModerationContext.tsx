'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 🛡️ Moderation Context - Sistema de Moderação e Denúncias
 * 
 * Chefex - Axis Software
 */

// ==================== TYPES ====================

export type ReportReason =
    | 'inappropriate_content'
    | 'spam'
    | 'plagiarism'
    | 'offensive_language'
    | 'harassment'
    | 'misinformation'
    | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'actioned';
export type ModerationAction = 'warn' | 'hide_content' | 'remove_content' | 'suspend_user' | 'ban_user';
export type ContentType = 'recipe' | 'comment' | 'user_profile';

export interface Report {
    id: string;
    contentType: ContentType;
    contentId: string;
    contentTitle?: string;
    reporterId: string;
    reporterName: string;
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;
    // Content author info
    authorId: string;
    authorName: string;
    // Admin action
    reviewedBy?: string;
    reviewedAt?: Date;
    actionTaken?: ModerationAction;
    adminNotes?: string;
}

export interface ModerationStats {
    totalReports: number;
    pendingReports: number;
    underReviewReports: number;
    resolvedToday: number;
    contentHidden: number;
    usersBanned: number;
}

export interface UserModerationStatus {
    userId: string;
    reportCount: number;
    warningCount: number;
    isSuspended: boolean;
    suspendedUntil?: Date;
    isBanned: boolean;
    bannedAt?: Date;
}

// ==================== CONSTANTS ====================

export const REPORT_REASONS: { value: ReportReason; label: string; icon: string }[] = [
    { value: 'inappropriate_content', label: 'Conteúdo Impróprio', icon: '🚫' },
    { value: 'spam', label: 'Spam', icon: '📧' },
    { value: 'plagiarism', label: 'Plágio', icon: '📋' },
    { value: 'offensive_language', label: 'Linguagem Ofensiva', icon: '🤬' },
    { value: 'harassment', label: 'Assédio', icon: '⚠️' },
    { value: 'misinformation', label: 'Desinformação', icon: '❌' },
    { value: 'other', label: 'Outro', icon: '📝' },
];

// Threshold for auto-hide
const AUTO_HIDE_THRESHOLD = 5;
const AUTO_REVIEW_THRESHOLD = 3;

// ==================== MOCK DATA ====================

const MOCK_REPORTS: Report[] = [
    {
        id: '1',
        contentType: 'recipe',
        contentId: 'r1',
        contentTitle: 'Receita Suspeita de Plágio',
        reporterId: 'u1',
        reporterName: 'João Silva',
        reason: 'plagiarism',
        description: 'Esta receita é copiada de outro site sem dar créditos.',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        authorId: 'a1',
        authorName: 'Chef Suspeito',
    },
    {
        id: '2',
        contentType: 'comment',
        contentId: 'c1',
        contentTitle: 'Comentário ofensivo em receita',
        reporterId: 'u2',
        reporterName: 'Maria Santos',
        reason: 'offensive_language',
        description: 'Linguagem inapropriada e insultos.',
        status: 'under_review',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        authorId: 'a2',
        authorName: 'Usuário Problemático',
    },
    {
        id: '3',
        contentType: 'recipe',
        contentId: 'r2',
        contentTitle: 'Spam promocional',
        reporterId: 'u3',
        reporterName: 'Carlos Oliveira',
        reason: 'spam',
        description: 'Receita com links de afiliados escondidos.',
        status: 'pending',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        authorId: 'a3',
        authorName: 'Spammer123',
    },
];

// ==================== CONTEXT ====================

interface ModerationContextType {
    // Reports
    reports: Report[];
    userReports: Map<string, Set<string>>; // contentId -> Set of reporterIds

    // Stats
    stats: ModerationStats;

    // User actions
    submitReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<{ success: boolean; message: string }>;
    hasUserReported: (contentId: string, userId: string) => boolean;
    getReportCountForContent: (contentId: string) => number;
    isContentHidden: (contentId: string) => boolean;

    // Admin actions
    updateReportStatus: (reportId: string, status: ReportStatus, adminNotes?: string) => void;
    takeAction: (reportId: string, action: ModerationAction) => void;
    getReportsByStatus: (status: ReportStatus) => Report[];
    getUserModerationStatus: (userId: string) => UserModerationStatus | null;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

const STORAGE_KEY = 'chefex_moderation';

export function ModerationProvider({ children }: { children: ReactNode }) {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [userReports, setUserReports] = useState<Map<string, Set<string>>>(new Map());
    const [hiddenContent, setHiddenContent] = useState<Set<string>>(new Set());
    const [userStatuses, setUserStatuses] = useState<Map<string, UserModerationStatus>>(new Map());

    // Calculate stats
    const stats: ModerationStats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        underReviewReports: reports.filter(r => r.status === 'under_review').length,
        resolvedToday: reports.filter(r =>
            (r.status === 'approved' || r.status === 'rejected') &&
            new Date(r.updatedAt).toDateString() === new Date().toDateString()
        ).length,
        contentHidden: hiddenContent.size,
        usersBanned: Array.from(userStatuses.values()).filter(u => u.isBanned).length,
    };

    // Submit a new report
    const submitReport = async (
        reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ): Promise<{ success: boolean; message: string }> => {
        // Check if user already reported this content
        const contentReporters = userReports.get(reportData.contentId) || new Set();
        if (contentReporters.has(reportData.reporterId)) {
            return { success: false, message: 'Você já denunciou este conteúdo.' };
        }

        const newReport: Report = {
            ...reportData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setReports(prev => [...prev, newReport]);

        // Track user reports
        setUserReports(prev => {
            const updated = new Map(prev);
            const reporters = updated.get(reportData.contentId) || new Set();
            reporters.add(reportData.reporterId);
            updated.set(reportData.contentId, reporters);
            return updated;
        });

        // Check if content should be auto-hidden
        const reportCount = (userReports.get(reportData.contentId)?.size || 0) + 1;
        if (reportCount >= AUTO_HIDE_THRESHOLD) {
            setHiddenContent(prev => new Set(prev).add(reportData.contentId));
        }

        // Auto-set to under_review if threshold reached
        if (reportCount >= AUTO_REVIEW_THRESHOLD) {
            setReports(prev => prev.map(r =>
                r.contentId === reportData.contentId && r.status === 'pending'
                    ? { ...r, status: 'under_review' as ReportStatus }
                    : r
            ));
        }

        return { success: true, message: 'Denúncia enviada. Obrigado por ajudar nossa comunidade!' };
    };

    // Check if user has reported content
    const hasUserReported = (contentId: string, userId: string): boolean => {
        return userReports.get(contentId)?.has(userId) || false;
    };

    // Get report count for content
    const getReportCountForContent = (contentId: string): number => {
        return userReports.get(contentId)?.size || 0;
    };

    // Check if content is hidden
    const isContentHidden = (contentId: string): boolean => {
        return hiddenContent.has(contentId);
    };

    // Admin: Update report status
    const updateReportStatus = (reportId: string, status: ReportStatus, adminNotes?: string) => {
        setReports(prev => prev.map(r =>
            r.id === reportId
                ? {
                    ...r,
                    status,
                    adminNotes: adminNotes || r.adminNotes,
                    updatedAt: new Date(),
                    reviewedAt: new Date(),
                    reviewedBy: 'admin', // Would be actual admin ID
                }
                : r
        ));
    };

    // Admin: Take moderation action
    const takeAction = (reportId: string, action: ModerationAction) => {
        const report = reports.find(r => r.id === reportId);
        if (!report) return;

        // Update report
        setReports(prev => prev.map(r =>
            r.id === reportId
                ? { ...r, status: 'actioned' as ReportStatus, actionTaken: action, updatedAt: new Date() }
                : r
        ));

        // Handle content-related actions
        if (action === 'hide_content' || action === 'remove_content') {
            setHiddenContent(prev => new Set(prev).add(report.contentId));
        }

        // Handle user-related actions
        if (action === 'warn' || action === 'suspend_user' || action === 'ban_user') {
            setUserStatuses(prev => {
                const updated = new Map(prev);
                const current = updated.get(report.authorId) || {
                    userId: report.authorId,
                    reportCount: 0,
                    warningCount: 0,
                    isSuspended: false,
                    isBanned: false,
                };

                if (action === 'warn') {
                    current.warningCount++;
                } else if (action === 'suspend_user') {
                    current.isSuspended = true;
                    current.suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
                } else if (action === 'ban_user') {
                    current.isBanned = true;
                    current.bannedAt = new Date();
                }

                updated.set(report.authorId, current);
                return updated;
            });
        }
    };

    // Get reports by status
    const getReportsByStatus = (status: ReportStatus): Report[] => {
        return reports.filter(r => r.status === status);
    };

    // Get user moderation status
    const getUserModerationStatus = (userId: string): UserModerationStatus | null => {
        return userStatuses.get(userId) || null;
    };

    return (
        <ModerationContext.Provider
            value={{
                reports,
                userReports,
                stats,
                submitReport,
                hasUserReported,
                getReportCountForContent,
                isContentHidden,
                updateReportStatus,
                takeAction,
                getReportsByStatus,
                getUserModerationStatus,
            }}
        >
            {children}
        </ModerationContext.Provider>
    );
}

export function useModeration() {
    const context = useContext(ModerationContext);
    if (!context) {
        throw new Error('useModeration must be used within ModerationProvider');
    }
    return context;
}
