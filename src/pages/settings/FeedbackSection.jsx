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
  const [category, setCategory] = useState('general');

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

  const categories = [
    { id: 'general', label: 'General Feedback' },
    { id: 'ocr_extraction', label: 'AI OCR & Prescription Parsing' },
    { id: 'recommendations', label: 'Medication Recommendations & Pricing' },
    { id: 'ui_ux', label: 'User Interface & Design' },
    { id: 'performance', label: 'Speed & Reliability' }
  ];

  const onSubmit = async (data) => {
    setSubmittingFeedback(true);
    try {
      await feedbackService.submit(data.feedbackText, data.rating, category);
      showToast('Feedback submitted to the AI refinements registry. Thank you!', 'success');
      reset();
      setCategory('general');
    } catch (error) {
      console.error(error);
      showToast('Failed to submit feedback.', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <Card id="feedback-card" variant="glass" className="p-6 bg-white/70 dark:bg-slate-900/80 text-left border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-101 dark:border-slate-800 pb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Submit App Feedback</h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Help us refine clinical OCR precision and recommendation accuracy</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Category Area</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white h-[44px]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Overall Satisfaction ({feedbackRating}/5)</label>
            <div className="flex gap-2 items-center h-[44px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star)}
                  className="p-1.5 text-amber-400 hover:scale-125 transition-transform cursor-pointer border-0 bg-transparent flex items-center justify-center"
                >
                  <MaterialIcon name="star" size="md" style={{ fontVariationSettings: star <= feedbackRating ? "'FILL' 1" : "'FILL' 0" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Your Message & Suggestions</label>
          <textarea
            rows="4"
            placeholder="Tell us how we can improve clinical accuracy, speed up OCR extraction, or enhance user workflows..."
            {...register('feedbackText')}
            className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl py-2.5 px-3 text-xs outline-none focus:ring-1 focus:ring-primary text-slate-900 dark:text-white ${
              errors.feedbackText ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
            }`}
          />
          {errors.feedbackText && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.feedbackText.message}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={submittingFeedback} variant="primary" className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer">
            {submittingFeedback ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-4 h-4" />}
            <span>Submit Feedback</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}

