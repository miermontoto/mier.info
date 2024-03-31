class Commit
	attr_accessor :message, :date, :version, :title, :hash, :author, :body

	def to_json(*a)
		{
			"title" => title,
			"message" => message,
			"date" => date,
			"hash" => hash,
			"version" => version
		}.to_json(*a)
	end
end


class Version
	# versions are in the form XX.y (major.minor)
	# they can also have a channel (alpha, beta, rc) and a channel number (optional)
	# examples: 18.1, 18.0 RC1, 19.0 alpha 2, 20.1 beta2
	# if no channel is mentioned, it's assumed to be RTW
	attr_accessor :major, :minor, :channel, :channel_number

	def to_json(*a)
		{
			"major" => major,
			"minor" => minor,
			"channel" => channel,
			"channel_number" => channel_number
		}.to_json(*a)
	end
end

require 'json'
require 'time'

delim = "¿¿¡¡"
allowed_authors = ["miermontoto", "Juan Mier"]

start = Time.now

branch = `git rev-parse --abbrev-ref HEAD`.strip
raw = `git log origin/#{branch} --pretty=format:"%B||%ad||%H||%an#{delim}" --date=short`
commits = []
raw.split(delim).each do |line|
	commit = Commit.new
	commit.body, commit.date, commit.hash, commit.author = line.split("||")
	commit.author.strip!

	# filter out commits
	next unless commit.author in allowed_authors # discard commits from other authors
	next if commit.body !~ /^\d{1,2}\.\d{1,2}(.*)/ # discard commits that don't have a version number (XX.y)
	next if commit.body =~ /Merge pull request/ # discard merge commits

	# process version
	commit.version = Version.new
	commit.version.major, commit.version.minor = commit.body.match(/^(\d{1,2})\.(\d{1,2})(.*)/).captures
	channel_matches = commit.body.match(/(alpha|beta|RC)( ?\d?)/)
	if channel_matches then
		channel_matches = channel_matches.captures.compact
		commit.version.channel = channel_matches.first
		commit.version.channel_number = channel_matches.last if channel_matches.length > 1
	end

	# process commit message
	split = commit.body.split("\n")
	split.shift unless commits.length == 0
	split.shift if split.first == ""
	if split.length > 1 then
		commit.title = split.first
		commit.message = split.drop(1).join("\n")
	else
		commit.title = commit.body
	end
	commit.title.strip!

	# sanitize HTML content
	commit.title = commit.title.gsub(/</, "&lt;").gsub(/>/, "&gt;")
	commit.message = commit.message.gsub(/</, "&lt;").gsub(/>/, "&gt;") unless commit.message.nil?

	# process markdown code as HTML
	commit.title = commit.title.gsub(/`(.*)`/, "<code>\\1</code>")
	commit.message = commit.message.gsub(/`(.*)`/, "<code>\\1</code>") unless commit.message.nil?

	commits << commit
end

# output json to file
File.open("src/content/data/changelog.json", "w") do |f|
	f.write(JSON.pretty_generate(commits))
end

puts "changelog!: processed and outputed changelog in #{Time.now - start} seconds"
