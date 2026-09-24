export default function AboutTeam() {
  const teamMembers = [
    { name: "Jenny Wilson", role: "CEO & Founder", image: "/our-awesome-team-img-1.png" },
    { name: "Jane Cooper", role: "Worker", image: "/our-awesome-team-img-2.png" },
    { name: "Cody Fisher", role: "Security Guard", image: "/our-awesome-team-img-3.png" },
    { name: "Robert Fox", role: "Senior Farmer Manager", image: "/our-awesome-team-img-4.png" },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#F9F9F9] border-t border-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Our Awesome Team</h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Pellentesque vulputate metus eu magna mollis, nec dictum lectus volutpat. Quisque sit amet arcu pretium tellus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="h-72 w-full overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "/Robert.png"; }}
                />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-base text-gray-900 mb-0.5">{member.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
