import { Link } from 'react-router-dom';
import { Compass, Target, CheckSquare, Calendar, BarChart3, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: Target, title: 'Goal Planning', desc: 'Set career goals and break them into manageable milestones.' },
    { icon: CheckSquare, title: 'Task Management', desc: 'Track daily tasks and stay on top of your deadlines.' },
    { icon: Calendar, title: 'Calendar View', desc: 'Visualize your tasks and deadlines in a calendar.' },
    { icon: BarChart3, title: 'Progress Analytics', desc: 'Track your progress with visual charts and insights.' },
  ];

  const steps = [
    { num: '1', title: 'Set Your Goals', desc: 'Define what you want to achieve in your career.' },
    { num: '2', title: 'Create Milestones', desc: 'Break big goals into smaller, actionable steps.' },
    { num: '3', title: 'Track Tasks', desc: 'Complete daily tasks and watch your progress grow.' },
    { num: '4', title: 'Achieve & Repeat', desc: 'Celebrate wins and set new goals.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CareerPathr</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-4 h-4" /> Plan Your Career Journey
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Career Plan,<br /><span className="text-primary-600">Simplified</span>
        </h1>
        <p className="text-lg text-gray-500 mt-6 max-w-2xl mx-auto">
          CareerPathr helps students set career goals, break them into milestones, track tasks, and stay organized — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/register" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
            Start Planning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Everything You Need</h2>
          <p className="text-gray-500 text-center mt-2 max-w-xl mx-auto">Powerful features designed for students who want to take control of their career journey.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map(f => (
              <div key={f.title} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center">How It Works</h2>
          <p className="text-gray-500 text-center mt-2">Four simple steps to plan your career.</p>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {steps.map(s => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">{s.num}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Why Students Love CareerPathr</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Target, title: 'Stay Focused', desc: 'Never lose sight of your career goals.' },
              { icon: Clock, title: 'Save Time', desc: 'Organize tasks and milestones efficiently.' },
              { icon: Shield, title: 'Private & Secure', desc: 'Your data stays safe and private.' },
            ].map(b => (
              <div key={b.title} className="text-center">
                <b.icon className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Plan Your Career?</h2>
          <p className="text-gray-500 mt-2">Start for free. No credit card required.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-3 mt-6 inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-gray-900">CareerPathr</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 CareerPathr. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}
