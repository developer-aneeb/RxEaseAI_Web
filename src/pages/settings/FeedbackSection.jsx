import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Send } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { feedbackSchema } from '../../utils/validation/zodSchemas';
import { feedbackService } from '../../services/feedbackService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MaterialIcon from '../../components/ui/MaterialIcon';

export default function FeedbackSection() {
  const showToast = useAppStore((state) => state.showToast);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      feedbackText: ''
    }
  });

  const feedbackRating = watch('rating');

  const onSubmit = async (data) => {
    setSubmittingFeedback(true);
    try {
      await feedbackService.submit(data.feedbackText, data.rating, 'general');
      showToast('Feedback submitted to the AI refinements registry. Thank you!', 'success');
      reset();
    } catch (error) {
      console.error(error);
      showToast('Failed to submit feedback.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <Card id="feedback-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Submit App Feedback</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer border-0 bg-transparent"
              >
                <MaterialIcon name="star" style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Your Message</label>
          <textarea
            rows="4"
            placeholder="How has your experience been with our prescription OCR ingestion?"
            {...register('feedbackText')}
            className={`w-full bg-slate-55 dark:bg-slate-950 border rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-950 dark:text-white ${
              errors.feedbackText ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
            }`}
          />
          {errors.feedbackText && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.feedbackText.message}</p>}
        </div>

        <Button type="submit" disabled={submittingFeedback} className="w-full bg-primary hover:bg-primary-container text-white py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
          {submittingFeedback ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-4 h-4" />}
          <span>Submit Feedback</span>
        </Button>
      </form>
    </Card>
  );
}
