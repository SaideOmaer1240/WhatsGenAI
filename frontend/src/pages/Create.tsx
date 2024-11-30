import CreateSession from '../components/session/CreateSession';

export default function Create() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-500 text-white text-center font-bold">
        Dashboard
      </header>
      <CreateSession />
    </div>
  );
}
