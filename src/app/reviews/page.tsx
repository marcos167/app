import GlobalReviewsClient from '@/components/reviews/GlobalReviewsClient';
import AdminTopbar from '@/components/admin/AdminTopbar'; // Using AdminTopbar for consistent nav, or create a public one

export default function ReviewsPage() {
    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            {/* Ideally this would use a Public Navigation, but using a placeholder or the same layout as Home */}
            <AdminTopbar />
            <GlobalReviewsClient />
        </main>
    );
}
